/**
 * MazeBreak – Sprint 0 Trello Builder (PRODUCTION++)
 * Creates: Workspace -> Board -> Lists -> Labels -> Cards -> Checklists -> Comments
 *
 * Features:
 *  - Dependency prefixes [S0-##] on card titles
 *  - Dev Notes comment on every card
 *  - Definition of Done checklist on every card
 *  - Execution + Acceptance checklists
 *  - Idempotent: safe to re-run (find-or-create for all resources)
 *
 * Requirements:
 *  - Node.js 18+
 *  - axios, dotenv
 *  - .env contains TRELLO_API_KEY and TRELLO_TOKEN
 */

require("dotenv").config();
const axios = require("axios");

const TRELLO_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BASE_URL = "https://api.trello.com/1";

if (!TRELLO_KEY || !TRELLO_TOKEN) {
  console.error("❌ Missing TRELLO_API_KEY or TRELLO_TOKEN in .env");
  process.exit(1);
}

const api = axios.create({ baseURL: BASE_URL, timeout: 30000 });

function params(extra = {}) {
  return { ...extra, key: TRELLO_KEY, token: TRELLO_TOKEN };
}

// ──────────────── Idempotent helpers (find-or-create) ────────────────

async function findOrCreateWorkspace(displayName, desc) {
  const res = await api.get("/members/me/organizations", { params: params() });
  const existing = res.data.find((o) => o.displayName === displayName);
  if (existing) {
    console.log("♻️  Workspace exists:", existing.id);
    return existing.id;
  }
  const created = await api.post("/organizations", null, {
    params: params({ displayName, desc }),
  });
  console.log("✅ Workspace Created:", created.data.id);
  return created.data.id;
}

async function findOrCreateBoard(workspaceId, name, desc) {
  const res = await api.get(`/organizations/${workspaceId}/boards`, {
    params: params(),
  });
  const existing = res.data.find((b) => b.name === name);
  if (existing) {
    console.log("♻️  Board exists:", existing.id);
    return existing.id;
  }
  const created = await api.post("/boards", null, {
    params: params({
      name,
      idOrganization: workspaceId,
      defaultLists: false,
      desc,
    }),
  });
  console.log("✅ Board Created:", created.data.id);
  return created.data.id;
}

async function findOrCreateList(boardId, name) {
  const res = await api.get(`/boards/${boardId}/lists`, { params: params() });
  const existing = res.data.find((l) => l.name === name);
  if (existing) {
    console.log("♻️  List exists:", name);
    return existing.id;
  }
  const created = await api.post("/lists", null, {
    params: params({ name, idBoard: boardId }),
  });
  console.log("✅ List Created:", name);
  return created.data.id;
}

async function findOrCreateLabel(boardId, name, color) {
  const res = await api.get(`/boards/${boardId}/labels`, { params: params() });
  const existing = res.data.find((l) => l.name === name && l.color === color);
  if (existing) {
    console.log("♻️  Label exists:", name);
    return existing.id;
  }
  const created = await api.post("/labels", null, {
    params: params({ idBoard: boardId, name, color }),
  });
  console.log("✅ Label Created:", name);
  return created.data.id;
}

async function findOrCreateCard(listId, name, desc, idLabels = []) {
  const res = await api.get(`/lists/${listId}/cards`, { params: params() });
  const existing = res.data.find((c) => c.name === name);
  if (existing) {
    console.log("♻️  Card exists:", name);
    return existing.id;
  }
  const created = await api.post("/cards", null, {
    params: params({
      idList: listId,
      name,
      desc,
      idLabels: idLabels.join(","),
    }),
  });
  console.log("✅ Card Created:", name);
  return created.data.id;
}

async function findOrCreateChecklist(cardId, title) {
  const res = await api.get(`/cards/${cardId}/checklists`, { params: params() });
  const existing = res.data.find((cl) => cl.name === title);
  if (existing) {
    console.log("  ♻️  Checklist exists:", title);
    return existing.id;
  }
  const created = await api.post("/checklists", null, {
    params: params({ idCard: cardId, name: title }),
  });
  return created.id || created.data.id;
}

async function addCheckItem(checklistId, name) {
  // Check if item already exists
  const res = await api.get(`/checklists/${checklistId}/checkItems`, {
    params: params(),
  });
  const existing = res.data.find((ci) => ci.name === name);
  if (existing) return;
  await api.post(`/checklists/${checklistId}/checkItems`, null, {
    params: params({ name, pos: "bottom" }),
  });
}

async function addCommentIfMissing(cardId, text) {
  const res = await api.get(`/cards/${cardId}/actions`, {
    params: params({ filter: "commentCard" }),
  });
  const existing = res.data.find(
    (a) => a.data && a.data.text && a.data.text.startsWith(text.substring(0, 40))
  );
  if (existing) {
    console.log("  ♻️  Comment exists on card");
    return;
  }
  await api.post(`/cards/${cardId}/actions/comments`, null, {
    params: params({ text }),
  });
  console.log("  ✅ Comment added");
}

function block(lines = []) {
  return lines.join("\n");
}

// ──────────────── Definition of Done (applies to every card) ────────────────

const DEFINITION_OF_DONE = [
  "Runs in Studio with zero errors in Output",
  "Server-authoritative rules not violated (no client damage outcomes)",
  "No gameplay logic placed in Workspace",
  "Code is modular (Managers/Systems), no spaghetti in random scripts",
  "No magic numbers: key constants centralized + named",
  "Basic logging added where it helps debugging (not spammy)",
  "Edge cases handled (nil targets, dead targets, missing humanoid)",
  "Performance sanity: no runaway loops / no heavy per-frame work",
  "Quick manual test performed and recorded in checklist notes (what you tested)",
];

// ──────────────── Dependency naming ────────────────

const CARD_IDS = {
  GATE: "S0-00",
  C1: "S0-01",
  C2: "S0-02",
  C3: "S0-03",
  C4: "S0-04",
  C5: "S0-05",
  C6: "S0-06",
  C7: "S0-07",
  C8: "S0-08",
  EXIT: "S0-09",
};

// ──────────────── Sprint 0 Production Spec ────────────────

function sprint0Spec(labelIds) {
  const L = labelIds;

  return [
    {
      id: CARD_IDS.GATE,
      title: "SPRINT 0 – Gate Rules (Read First)",
      dependsOn: [],
      labels: [L.Critical, L.Architecture],
      desc: block([
        "## Sprint Goal",
        "Build a tight, readable, fair combat sandbox proving:",
        "- Combat feels responsive",
        "- Telegraphs are readable",
        "- Damage feels satisfying",
        "- Death feels fair",
        "- Server authority is stable",
        "",
        "## Constraints (Non-Negotiable)",
        "- Solo play only",
        "- Flat test arena only",
        "- 1 enemy (Zombie Tier 1)",
        "- 1 weapon / 1 attack input",
        "- Server-authoritative combat",
        "- Clean Roblox architecture from day one",
        "",
        "## What You DO NOT Build in Sprint 0",
        "- StageManager / procedural rooms",
        "- Loot / XP / economy / DataStore",
        "- Affinity full system (placeholder only)",
        "- Multiple weapons",
        "- Boss",
        "",
        "## Dependency Model",
        "Cards are ordered. Finish earlier IDs first. If you skip dependencies, you will create bugs and rework.",
      ]),
      checklists: [
        {
          title: "Sprint 0 Setup Checklist",
          items: [
            "Confirm test place is a flat arena (no stages)",
            "Confirm only one enemy + one weapon scope",
            "Confirm server owns hit + damage outcomes",
            "Confirm NO gameplay logic in Workspace",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Treat Sprint 0 like building the game's spine.",
        "- If you \"just hack it for now,\" Sprint 1 will collapse under debt.",
        "- Keep every combat decision on server. Client only requests + displays feedback.",
      ]),
    },

    {
      id: CARD_IDS.C1,
      title: "CARD 1 — Project Foundation Setup",
      dependsOn: [CARD_IDS.GATE],
      labels: [L.Critical, L.Architecture, L.Server],
      desc: block([
        "## Objective",
        "Establish clean architecture before writing gameplay logic.",
        "",
        "## Depends On",
        `- ${CARD_IDS.GATE}`,
        "",
        "## Folder Structure (Create Immediately)",
        "ServerScriptService",
        "  - Managers",
        "  - Systems",
        "",
        "ReplicatedStorage",
        "  - Remotes",
        "  - Shared",
        "  - Data",
        "",
        "StarterPlayer",
        "  - StarterPlayerScripts",
        "",
        "## Completion Criteria",
        "- Server boots without errors",
        "- Structure exists exactly as specified",
        "- No combat/health logic yet",
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "Create folders exactly as specified (no extras yet)",
            "Create ServerScriptService/Bootstrap.server.lua",
            "Bootstrap prints startup banner + confirms folders/modules found",
            "Add placeholder modules: Managers/CombatManager, Systems/DamageResolver (no logic yet)",
            "Server starts clean with zero errors/warnings",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Put long-lived systems in ServerScriptService as ModuleScripts; bootstrap should be thin.",
        "- Don't start writing gameplay logic until this is clean; otherwise you'll scatter dependencies.",
        "- Keep naming consistent: Managers = orchestration, Systems = pure logic utilities.",
      ]),
    },

    {
      id: CARD_IDS.C2,
      title: "CARD 2 — Remotes + InputController (Client)",
      dependsOn: [CARD_IDS.C1],
      labels: [L.Critical, L.Client, L.Combat],
      desc: block([
        "## Objective",
        "Create responsive attack input that requests server validation.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C1}`,
        "",
        "## RemoteEvent",
        "ReplicatedStorage/Remotes/AttackRequest (RemoteEvent)",
        "",
        "## Client Script",
        "StarterPlayerScripts/InputController.client.lua",
        "",
        "## Responsibilities",
        "- Detect attack input (mouse button 1 or space)",
        "- Fire AttackRequest:FireServer()",
        "- Local throttle ONLY for input feel (visual). Client never decides hit/damage.",
        "",
        "## Completion Criteria",
        "- Clicking/pressing triggers server call",
        "- No spam (client throttle + server validation later)",
        "- No client damage logic anywhere",
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "Create AttackRequest RemoteEvent in ReplicatedStorage/Remotes",
            "Create InputController.client.lua in StarterPlayerScripts",
            "Bind attack input (UIS or CAS) and fire AttackRequest:FireServer()",
            "Add local throttle to prevent spam FireServer (visual only)",
            "Test: clicks fire instantly with no console errors",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "Spam click does NOT freeze client",
            "Remote fires instantly on input",
            "No client damage calculations exist",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Client throttle is a UX improvement only; server must still enforce real cooldown.",
        "- Don't send 'hit results' from client. Only send \"I attempted attack.\"",
        "- Keep InputController tiny; avoid mixing UI logic in here.",
      ]),
    },

    {
      id: CARD_IDS.C3,
      title: "CARD 3 — CombatManager (Server Authority Core)",
      dependsOn: [CARD_IDS.C2, CARD_IDS.C1],
      labels: [L.Critical, L.Server, L.Combat],
      desc: block([
        "## Objective",
        "Server-authoritative attack validation + hit detection + damage requests.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C1}`,
        `- ${CARD_IDS.C2}`,
        "",
        "## Create",
        "ServerScriptService/Managers/CombatManager.server.lua",
        "",
        "## Responsibilities",
        "- Listen to AttackRequest",
        "- Validate server cooldown per player",
        "- Perform hit detection (Sprint 0 = distance check)",
        "- Call DamageResolver.ApplyDamage(attacker, target, amount)",
        "- Enforce invulnerability window",
        "",
        "## Completion Criteria",
        "- Server rejects spam attacks",
        "- Enemy takes damage via DamageResolver only",
        "- Invulnerability prevents double-hit bug",
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "CombatManager listens to AttackRequest.OnServerEvent",
            "Implement server cooldown tracking (lastAttackTime[player])",
            "Implement simple distance hit check vs Zombie",
            "Call DamageResolver.ApplyDamage() on hit",
            "Add invulnerability window logic (i-frames) per target",
            "Test: spam click does not increase DPS beyond cooldown",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "No double damage from one click",
            "Attacks miss when out of range",
            "Invuln blocks rapid chain hits",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Keep CombatManager as an orchestrator: validate + route to systems.",
        "- Don't subtract health in CombatManager. Always go through DamageResolver.",
        "- If you add effects, don't hardcode them here—emit events/hooks later.",
      ]),
    },

    {
      id: CARD_IDS.C4,
      title: "CARD 4 — DamageResolver (Single Source of Truth)",
      dependsOn: [CARD_IDS.C3, CARD_IDS.C1],
      labels: [L.Critical, L.Server, L.Architecture],
      desc: block([
        "## Objective",
        "Centralize all damage/death logic in one system.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C1}`,
        `- ${CARD_IDS.C3}`,
        "",
        "## Create",
        "ServerScriptService/Systems/DamageResolver.lua (ModuleScript)",
        "",
        "## API",
        "DamageResolver.ApplyDamage(attacker, target, baseDamage)",
        "",
        "## Completion Criteria",
        "- All damage routed through DamageResolver",
        "- Death triggers once, cleanly",
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "Create DamageResolver.ApplyDamage(attacker, target, baseDamage)",
            "Add guards (nil, dead, missing humanoid) + clamp health >= 0",
            "Implement enemy death: delay then Destroy",
            "Implement player death placeholder: disable movement + message",
            "Ensure only DamageResolver modifies health values",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "Target death triggers once",
            "No negative HP after repeated hits",
            "No other script subtracts health directly",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- This module becomes your long-term combat 'truth.' Keep it clean.",
        "- Make it deterministic and boring (that's good). Effects/juice can layer later.",
        "- Avoid hidden side effects; return a result object later if needed.",
      ]),
    },

    {
      id: CARD_IDS.C5,
      title: "CARD 5 — Enemy: Zombie (Tier 1 State Machine)",
      dependsOn: [CARD_IDS.C4, CARD_IDS.C3],
      labels: [L.Critical, L.Server, L.Enemy, L.Combat],
      desc: block([
        "## Objective",
        "One functional enemy with readable telegraphs and fair attacks.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C3}`,
        `- ${CARD_IDS.C4}`,
        "",
        "## Template Location",
        "ServerStorage/EnemyTemplates/Zombie",
        "",
        "## State Machine",
        "Idle -> Chase -> WindUp -> Attack -> Cooldown",
        "",
        '## Fairness Requirement',
        'If player dies and says: "I didn\'t see that coming." you failed.',
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "Create Zombie template in ServerStorage/EnemyTemplates",
            "Implement detection within 25 studs (Idle -> Chase)",
            "Implement MoveTo chase (no pathfinding)",
            "Implement WindUp telegraph (0.5s) before damage",
            "Apply damage via DamageResolver once per swing",
            "Cooldown (1.5s) prevents chain hits",
            "Test: player can back up during wind-up to avoid hit",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "Zombie does not hit if player leaves range before attack moment",
            "Zombie cannot deal damage during Cooldown",
            "Telegraph is visually readable and consistent",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Your enemy is a 'teacher'—it teaches fairness through consistent telegraphs.",
        "- Don't hide attack timing in animations only; sync with clear state timing.",
        "- Ensure AI loop isn't running heavy logic every frame. Use heartbeat carefully.",
      ]),
    },

    {
      id: CARD_IDS.C6,
      title: "CARD 6 — Health System + Damage Feedback (Player & Enemy)",
      dependsOn: [CARD_IDS.C4, CARD_IDS.C5],
      labels: [L.Critical, L.Server, L.UI],
      desc: block([
        "## Objective",
        "Health behavior + feedback that supports fairness and readability.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C4}`,
        `- ${CARD_IDS.C5}`,
        "",
        "## Targets",
        "Player: MaxHealth=100, Enemy: Health=50",
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "Set player MaxHealth to 100 on spawn",
            "Set zombie health to 50 on spawn",
            "Player damage feedback (flash red + hit sound)",
            "Enemy feedback (flinch / brief pause / reaction)",
            "Player death placeholder (disable movement + fade + message)",
            "Enemy death delay then destroy",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "No desync: server is truth",
            "Player can't die twice",
            "Enemy stops acting after death",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Keep feedback decoupled: DamageResolver triggers events/hooks; UI listens.",
        "- Don't mix UI creation with server health logic.",
        "- Clamp and validate everything; early prototypes die from edge cases.",
      ]),
    },

    {
      id: CARD_IDS.C7,
      title: "CARD 7 — Basic HUD (Server-Truth Health Only)",
      dependsOn: [CARD_IDS.C6],
      labels: [L.Critical, L.Client, L.UI],
      desc: block([
        "## Objective",
        "Minimal HUD reflecting real server health.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C6}`,
        "",
        "## UI",
        "- Health bar",
        "- Numeric health display",
      ]),
      checklists: [
        {
          title: "Execution Checklist (Ordered)",
          items: [
            "Create ScreenGui with health bar + number",
            "Bind UI updates to replicated health source (Sprint 0 acceptable)",
            "Clamp UI values to 0–100",
            "Test: UI updates immediately on damage",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "UI matches server health truth",
            "No heavy per-frame loops for UI updates",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Avoid per-frame polling. Use Changed events where possible.",
        "- Don't 'predict' health client-side. Sprint 0 = trust server.",
        "- Keep HUD simple; this is signal, not polish.",
      ]),
    },

    {
      id: CARD_IDS.C8,
      title: "CARD 8 — Feel Tuning Pass (20+ Fights Minimum)",
      dependsOn: [CARD_IDS.C7],
      labels: [L.Critical, L.Polish, L.Combat],
      desc: block([
        "## Objective",
        "Make it FEEL right. No feature expansion. Only iteration.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C7}`,
        "",
        "## Minimum Playtest",
        "Play 20+ fights.",
      ]),
      checklists: [
        {
          title: "Tuning Runs (Ordered)",
          items: [
            "Run 10 fights baseline and note pain points",
            "Adjust one variable at a time (cooldown/range/speed/wind-up/i-frames)",
            "Run 10 fights iteration build and compare",
            "Lock best values and document final tuning numbers in this card",
          ],
        },
        {
          title: "Acceptance Tests",
          items: [
            "Telegraphs are readable (you can react consistently)",
            "Spam clicking doesn't dominate",
            "Death feels fair (no surprise hits)",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- Don't 'fix' feel by adding features. Fix feel with timing and clarity.",
        "- If it feels cheap, increase telegraph clarity before changing damage numbers.",
        "- Record final values so Sprint 1 doesn't accidentally drift them.",
      ]),
    },

    {
      id: CARD_IDS.EXIT,
      title: "SPRINT 0 EXIT CHECKLIST — Ship/No-Ship Gate",
      dependsOn: [CARD_IDS.C8],
      labels: [L.Critical, L.Architecture, L.Combat],
      desc: block([
        "## You move forward ONLY if ALL checks are true.",
        "",
        "## Depends On",
        `- ${CARD_IDS.C8}`,
        "",
        "If any item fails: you stay in Sprint 0 until it passes.",
      ]),
      checklists: [
        {
          title: "Gate Checks",
          items: [
            "Combat responsiveness feels immediate (no noticeable input delay)",
            "Telegraphs readable (player can react during wind-up)",
            "Damage satisfying (clear feedback on hit)",
            "No chain-death / double-hit bug",
            "Server rejects spam attacks reliably",
            "Health UI matches server truth",
            "No major errors in Output during play",
            "Death feels fair (no surprise hits)",
          ],
        },
      ],
      devNotes: block([
        "DEV NOTES (Architecture & Pitfalls)",
        "- This is your quality gate. If you skip it, you'll build a bigger bad game faster.",
        "- 'Mostly works' is not good enough for combat.",
      ]),
    },
  ];
}

// ──────────────── Main ────────────────

async function main() {
  console.log("Starting MazeBreak Sprint 0 Trello build (idempotent)...\n");

  // 1) Workspace & Board
  const workspaceId = await findOrCreateWorkspace(
    "MazeBreak Development",
    "Workspace for MazeBreak Roblox game development (Sprint-driven execution)."
  );
  const boardId = await findOrCreateBoard(
    workspaceId,
    "MazeBreak – Core Development",
    "Sprint board for MazeBreak. Sprint 0 is a combat sandbox gate. No gate pass = no Sprint 1."
  );

  // 2) Lists
  const listSprint0 = await findOrCreateList(boardId, "🧪 Sprint 0 – Combat Prototype");
  await findOrCreateList(boardId, "🔜 Sprint 1 – Core Loop");
  await findOrCreateList(boardId, "📦 Backlog");
  await findOrCreateList(boardId, "✅ Done");

  // 3) Labels (IDs by key)
  const labelIds = {
    Architecture: await findOrCreateLabel(boardId, "Architecture", "purple"),
    Client: await findOrCreateLabel(boardId, "Client", "blue"),
    Server: await findOrCreateLabel(boardId, "Server", "red"),
    Combat: await findOrCreateLabel(boardId, "Combat", "orange"),
    Enemy: await findOrCreateLabel(boardId, "Enemy", "green"),
    UI: await findOrCreateLabel(boardId, "UI", "yellow"),
    Polish: await findOrCreateLabel(boardId, "Polish", "pink"),
    Critical: await findOrCreateLabel(boardId, "Critical", "black"),
  };

  // 4) Sprint 0 Cards + Checklists + Comments
  const cards = sprint0Spec(labelIds);

  for (const cardSpec of cards) {
    const titleWithId = `[${cardSpec.id}] ${cardSpec.title}`;

    const descWithDeps = block([
      cardSpec.desc,
      "",
      "----",
      "## Dependency Notes",
      cardSpec.dependsOn.length
        ? cardSpec.dependsOn.map((d) => `- Finish: ${d} before this`).join("\n")
        : "- None (starting point)",
    ]);

    const cardId = await findOrCreateCard(
      listSprint0,
      titleWithId,
      descWithDeps,
      cardSpec.labels || []
    );

    // Dev Notes comment
    if (cardSpec.devNotes) {
      await addCommentIfMissing(cardId, cardSpec.devNotes);
    }

    // Definition of Done checklist (every card)
    const dodId = await findOrCreateChecklist(cardId, "Definition of Done (Global)");
    for (const item of DEFINITION_OF_DONE) {
      await addCheckItem(dodId, item);
    }

    // Card-specific checklists
    for (const cl of cardSpec.checklists || []) {
      const clId = await findOrCreateChecklist(cardId, cl.title);
      for (const item of cl.items || []) {
        await addCheckItem(clId, item);
      }
    }
  }

  console.log(
    "\n✅ Sprint 0 PRODUCTION++ complete — dependencies + dev notes + DoD on every card."
  );
  console.log("   Safe to re-run (idempotent).");
}

main().catch((err) => {
  const msg = err?.response?.data
    ? JSON.stringify(err.response.data, null, 2)
    : err.message;
  console.error("❌ Trello build failed:", msg);
  process.exit(1);
});
