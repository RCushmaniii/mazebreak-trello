# MazeBreak Trello

Trello Power-Up and project management automation for **MazeBreak** — a combat-driven Roblox maze game.

**Live Site:** [mazebreak-trello.vercel.app](https://mazebreak-trello.vercel.app/)
**Documentation:** [mazebreak-trello.vercel.app/docs](https://mazebreak-trello.vercel.app/docs)
**GitHub:** [github.com/RCushmaniii/mazebreak-trello](https://github.com/RCushmaniii/mazebreak-trello)

## What This Repo Contains

| Component | Description |
|---|---|
| **Board Setup Script (PRODUCTION++)** | Idempotent Node.js script that provisions a complete Trello workspace, board, 8 workflow lists, 8 labels, and 10 fully-specified Sprint 0 cards via the Trello REST API |
| **Marketing Landing Page** | Dark-mode single-page site with animated terminal demo, interactive board hotspots, lazy-loaded video player, and scroll animations |
| **Documentation Site** | 8-section technical docs with sidebar navigation, scroll spy, and code blocks with copy buttons |
| **Trello Power-Up Connector** | Minimal Vercel-hosted Power-Up registered with Trello for the MazeBreak workspace |

## Board Layout

The setup script creates a production-grade sprint board with full workflow tracking:

| List | Purpose |
|---|---|
| Instructions | Reference cards — board overview, card lifecycle, Trello tips, dependency map |
| Sprint 0 – Combat Prototype | Cards waiting to be started. Work in `[S0-##]` order. |
| In Progress | Cards actively being worked on (max 1–2 at a time) |
| Review / Playtest | Code-complete cards awaiting testing/validation |
| Blocked | Stuck cards (comment explaining WHY required) |
| Done | Finished, tested, and meets Definition of Done |
| Sprint 1 – Core Loop | Future work. Locked until Sprint 0 exit gate passes. |
| Backlog | Ideas and future cards not committed to any sprint |

## Sprint 0 Cards

10 cards with dependency prefixes `[S0-00]` through `[S0-09]`:

| ID | Card | Key Labels |
|---|---|---|
| S0-00 | Gate Rules (Read First) | Critical, Architecture |
| S0-01 | Project Foundation Setup | Critical, Architecture, Server |
| S0-02 | Remotes + InputController (Client) | Critical, Client, Combat |
| S0-03 | CombatManager (Server Authority Core) | Critical, Server, Combat |
| S0-04 | DamageResolver (Single Source of Truth) | Critical, Server, Architecture |
| S0-05 | Enemy: Zombie (Tier 1 State Machine) | Critical, Server, Enemy, Combat |
| S0-06 | Health System + Damage Feedback | Critical, Server, UI |
| S0-07 | Basic HUD (Server-Truth Health Only) | Critical, Client, UI |
| S0-08 | Feel Tuning Pass (20+ Fights Minimum) | Critical, Polish, Combat |
| S0-09 | EXIT CHECKLIST — Ship/No-Ship Gate | Critical, Architecture, Combat |

### Every Card Includes

- **Execution Checklist** — ordered implementation steps
- **Acceptance Tests** — pass/fail validation criteria
- **Definition of Done (Global)** — 9-item quality checklist applied to every card
- **Dev Notes comment** — architecture pitfalls and guidance
- **Dependency notes** — which `[S0-##]` cards must be Done first

### Dependency Chain

```
[S0-00] Gate Rules
   └── [S0-01] Foundation
          └── [S0-02] Input
                 └── [S0-03] CombatManager
                        └── [S0-04] DamageResolver
                               ├── [S0-05] Zombie
                               └── [S0-06] Health + Feedback
                                      └── [S0-07] HUD
                                             └── [S0-08] Feel Tuning
                                                    └── [S0-09] EXIT GATE
```

## Labels

| Label | Color |
|---|---|
| Architecture | Purple |
| Client | Blue |
| Server | Red |
| Combat | Orange |
| Enemy | Green |
| UI | Yellow |
| Polish | Pink |
| Critical | Black |

## Landing Page Features

The marketing site at [mazebreak-trello.vercel.app](https://mazebreak-trello.vercel.app/) includes:

- **Animated terminal demo** — typing animation showing the `node trelloSetup.js` command and output
- **Problem/Solution split** — chaos vs. structured board comparison with real screenshots
- **Interactive board hotspots** — hover over dots on the board screenshot to see feature tooltips
- **5 feature outcome cards** — cards, checklists, dependencies, dev notes, idempotency
- **Animated counters** — 10 cards, 100+ checklist items, 8 lists, 9 quality gates
- **Lazy-loaded video player** — click-to-play with poster overlay (zero network cost until interaction)
- **Comparison table** — MazeBreak vs. Manual Setup across 7 dimensions
- **Built for Serious Teams** — speed, discipline, repeatability pillars
- **Share bar** — Copy Link, X/Twitter, and LinkedIn sharing in the footer
- **Technical SEO** — JSON-LD structured data, Open Graph, Twitter Cards, canonical URL
- **Performance optimized** — deferred font loading, image preloading, `decoding="async"`, CLS prevention
- **Accessible** — keyboard navigation, reduced motion support, semantic HTML, ARIA labels
- **Responsive** — mobile hamburger menu, fluid typography, adaptive grid layouts

## Idempotent Design

The setup script uses find-or-create for every resource — workspace, board, lists, labels, cards, checklists, check items, and comments. Safe to re-run at any time without creating duplicates.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Trello API Key and Token](https://trello.com/power-ups/admin)

## Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/RCushmaniii/mazebreak-trello.git
   cd mazebreak-trello
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   TRELLO_API_KEY=your_api_key
   TRELLO_SECRET_KEY=your_secret_key
   TRELLO_TOKEN=your_token
   ```

4. **Run the board setup**

   ```bash
   node trelloSetup.js
   ```

   Creates the full workspace, board, workflow lists, labels, and all Sprint 0 cards with checklists and dev notes in one shot.

## Deployment

The site is hosted on [Vercel](https://vercel.com/). The `vercel.json` config serves from the `public/` directory with the following routes:

| Route | Serves |
|---|---|
| `/` | `index.html` — Marketing landing page |
| `/connector` | `connector.html` — Trello Power-Up SDK connector |
| `/docs` | `docs.html` — Technical documentation |
| `/*` (catch-all) | `index.html` — SPA fallback |

Deploy with:

```bash
vercel --prod
```

## Project Structure

```
mazebreak-trello/
  public/
    index.html              # Marketing landing page
    docs.html               # Technical documentation (8 sections)
    connector.html          # Trello Power-Up SDK connector
    favicon.svg             # MT monogram favicon (cyan accent)
    images/
      mazebreak-OG.jpg      # 1024x1024 Open Graph social sharing image
      mazebreak-trello.jpg  # Board screenshot (hero/poster)
      mazebreak-trello01.jpg - 04.jpg  # Portfolio slider images
      mazebreak-trello-poster.jpg      # Video player poster
    video/
      MazeBreak__Sprint_as_Code.mp4    # Explainer video
  trelloSetup.js            # PRODUCTION++ board provisioning script (idempotent)
  vercel.json               # Vercel routing + output directory config
  PORTFOLIO.md              # Portfolio metadata for CushLabs portfolio app
  LESSONS_LEARNED.md        # Project retrospective and technical insights
  LICENSE                   # MIT — CushLabs AI Services
  .env                      # API credentials (not committed)
  package.json              # Node.js dependencies (axios, dotenv)
```

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime for setup script |
| axios | HTTP client for Trello API |
| dotenv | Environment variable management |
| Vercel | Static site hosting with SPA rewrites |
| Trello REST API | Board/card/label/checklist provisioning |
| Vanilla HTML/CSS/JS | Landing page, docs, and video player (zero frameworks) |

## License

[MIT](LICENSE) - CushLabs AI Services
