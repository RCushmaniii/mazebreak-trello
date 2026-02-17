# MazeBreak Trello

Trello Power-Up and project management automation for **MazeBreak** — a combat-driven Roblox maze game.

This repo contains two things:

1. **Trello Power-Up Connector** — A minimal Vercel-hosted Power-Up registered with Trello for the MazeBreak workspace.
2. **Board Setup Script (PRODUCTION++)** — An idempotent Node.js script that provisions a complete Trello workspace, board, workflow lists, labels, and fully-specified Sprint 0 cards via the Trello REST API.

## Board Layout

The setup script creates a production-grade sprint board with full workflow tracking:

| List | Purpose |
|---|---|
| 📋 Instructions | Reference cards — board overview, card lifecycle, Trello tips, dependency map |
| 🧪 Sprint 0 – Combat Prototype | Cards waiting to be started. Work in `[S0-##]` order. |
| 🚧 In Progress | Cards actively being worked on (max 1–2 at a time) |
| 🔍 Review / Playtest | Code-complete cards awaiting testing/validation |
| 🚫 Blocked | Stuck cards (comment explaining WHY required) |
| 🔜 Sprint 1 – Core Loop | Future work. Locked until Sprint 0 exit gate passes. |
| 📦 Backlog | Ideas and future cards not committed to any sprint |
| ✅ Done | Finished, tested, and meets Definition of Done |

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

## Trello Power-Up

The Power-Up connector is hosted on Vercel and serves `public/index.html`, which initializes the Trello Power-Up SDK. Register it at the [Trello Power-Ups admin](https://trello.com/power-ups/admin) with your Vercel deployment URL.

## Project Structure

```
mazebreak-trello/
  public/
    index.html        # Trello Power-Up connector
    favicon.svg       # Project favicon
  trelloSetup.js      # PRODUCTION++ board provisioning script (idempotent)
  vercel.json         # Vercel routing config
  .env                # API credentials (not committed)
  package.json        # Node.js dependencies
```

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime for setup script |
| axios | HTTP client for Trello API |
| dotenv | Environment variable management |
| Vercel | Power-Up hosting |
| Trello REST API | Board/card/label/checklist provisioning |

## License

[MIT](LICENSE) - CushLabs AI Services
