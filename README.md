# MazeBreak Trello

Trello Power-Up and project management automation for **MazeBreak** — a combat-driven Roblox maze game.

This repo contains two things:

1. **Trello Power-Up Connector** — A minimal Vercel-hosted Power-Up registered with Trello for the MazeBreak workspace.
2. **Board Setup Script** — A Node.js script that provisions a complete Trello workspace, board, sprint lists, labels, and cards via the Trello REST API.

## Board Structure

The setup script creates a production-ready sprint board:

| Lists | Labels | Sprint 0 Cards |
|---|---|---|
| Sprint 0 – Combat Prototype | Architecture (purple) | Project Foundation Setup |
| Sprint 1 – Core Loop | Client (blue) | Player Movement & Input |
| Backlog | Server (red) | CombatManager (Server) |
| Done | Combat (orange) | DamageResolver System |
| | Enemy (green) | Enemy: Zombie (Tier 1) |
| | UI (yellow) | Health System |
| | Polish (pink) | Basic HUD |
| | Critical (black) | Feel Tuning Pass |

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

   This creates the workspace, board, lists, labels, and all Sprint 0 cards in one shot.

## Trello Power-Up

The Power-Up connector is hosted on Vercel and serves `public/index.html`, which initializes the Trello Power-Up SDK. Register it at the [Trello Power-Ups admin](https://trello.com/power-ups/admin) with your Vercel deployment URL.

## Project Structure

```
mazebreak-trello/
  public/
    index.html        # Trello Power-Up connector
    favicon.svg       # Project favicon
  trelloSetup.js      # Board provisioning script
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
| Trello REST API | Board/card/label provisioning |

## License

[MIT](LICENSE) - CushLabs AI Services
