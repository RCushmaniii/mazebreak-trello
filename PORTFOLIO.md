---
# =============================================================================
# PORTFOLIO.md — MazeBreak Trello
# =============================================================================

portfolio_enabled: true
portfolio_priority: 4
portfolio_featured: false
portfolio_last_reviewed: "2026-02-17"

title: "MazeBreak Trello Board Automation"
tagline: "Idempotent sprint board provisioning via Trello REST API for Roblox game development"
slug: "mazebreak-trello"

category: "Developer Tools"
target_audience: "Game development teams and project managers who need repeatable, version-controlled project board setup"
tags:
  - "developer-tools"
  - "automation"
  - "project-management"
  - "trello"
  - "game-development"
  - "api-integration"

thumbnail: "/images/mazebreak-trello.jpg"
hero_images:
  - "/images/mazebreak-trello.jpg"
  - "/images/mazebreak-trello01.jpg"
  - "/images/mazebreak-trello02.jpg"
  - "/images/mazebreak-trello03.jpg"
  - "/images/mazebreak-trello04.jpg"
  - "/images/mazebreak-trello05.jpg"
demo_video_url: "/video/MazeBreak__Sprint_as_Code.mp4"

live_url: "https://mazebreak-trello.vercel.app/"
demo_url: "https://mazebreak-trello.vercel.app/#demo"
case_study_url: ""

problem_solved: |
  Setting up a sprint board manually in Trello is slow, error-prone, and not
  repeatable. Cards lack consistent structure — some have checklists, some don't.
  Acceptance criteria and definition-of-done standards get forgotten. Dependencies
  between cards exist only in people's heads. When a board needs to be rebuilt or
  replicated for a new sprint, all that structure has to be recreated from scratch.

key_outcomes:
  - "10 fully-specified Sprint 0 cards provisioned in a single command"
  - "Every card ships with execution checklists, acceptance tests, Definition of Done, and dev notes"
  - "Dependency chain encoded in card titles ([S0-00] through [S0-09]) and descriptions"
  - "8 workflow lists including Instructions, In Progress, Review/Playtest, and Blocked"
  - "Idempotent design — safe to re-run without creating duplicates"
  - "4 instruction cards providing board overview, card lifecycle, Trello tips, and dependency map"

tech_stack:
  - "Node.js"
  - "axios"
  - "dotenv"
  - "Trello REST API"
  - "Vercel"

complexity: "Production"
---

## Overview

MazeBreak Trello is a Node.js automation tool that provisions a complete, production-grade sprint board via the Trello REST API. One command creates a workspace, board, workflow lists, color-coded labels, and 10 fully-specified sprint cards — each with ordered execution checklists, acceptance tests, a global Definition of Done, developer notes, and encoded dependency chains.

The tool also deploys a minimal Trello Power-Up connector on Vercel for future board integrations.

## The Challenge

Manual Trello board setup creates compounding problems for sprint-driven game development:

- **Inconsistent card structure:** When cards are created by hand, some get checklists and acceptance criteria while others get a title and nothing else. Quality standards drift across the board.
- **Lost dependencies:** Card ordering and prerequisite relationships exist only in the creator's head. New team members or future sprints have no way to understand the intended execution sequence.
- **No quality gates:** Without a Definition of Done attached to every card, "done" becomes subjective. Cards move to the Done column without validation, and bugs surface in later sprints.
- **Setup is not repeatable:** If the board needs to be rebuilt, replicated for another sprint, or stood up in a new workspace, all the structure has to be manually recreated — including dozens of checklist items and descriptions.
- **Developer context is missing:** Architecture decisions, pitfalls, and implementation guidance live in separate documents (if they exist at all), disconnected from the cards where the work happens.

## The Solution

The setup script addresses each problem with a code-first, API-driven approach:

**Structured Cards with Encoded Dependencies:**

- Every card title includes a dependency prefix (`[S0-00]` through `[S0-09]`)
- Card descriptions include a "Depends On" section listing prerequisite card IDs
- An instruction card on the board provides an ASCII dependency tree for quick reference
- Cards must be completed in order — the structure enforces discipline without requiring a human to police it

**Consistent Quality Standards:**

- Every card automatically receives a 9-item Definition of Done checklist covering zero-error runs, server authority, code modularity, edge case handling, and manual testing
- Execution checklists provide ordered implementation steps so nothing is skipped
- Acceptance test checklists define pass/fail criteria before a card can leave Review

**Developer Notes as First-Class Content:**

- Each card receives a comment with architecture pitfalls and implementation guidance
- Notes are attached as comments (not buried in descriptions) so they stay visible in the activity feed
- Guidance is card-specific — the Zombie card warns about AI loop performance, the DamageResolver card warns about hidden side effects

**Idempotent by Design:**

- Every resource (workspace, board, list, label, card, checklist, check item, comment) uses a find-or-create pattern
- Running the script twice produces the same board state — no duplicates, no errors
- Safe to use as a baseline reset or to add missing resources after manual changes

**Workflow Lists for Real Sprint Tracking:**

- 8 lists model the full card lifecycle: Instructions → Sprint 0 → In Progress → Review/Playtest → Done, with Blocked for stuck cards and Backlog for future work
- Instruction cards on the board explain how to move cards, when to update them, and keyboard shortcuts for efficient Trello use

## Technical Highlights

- **Trello REST API Integration:** Full CRUD operations across organizations, boards, lists, labels, cards, checklists, check items, and comments — all authenticated via API key and token
- **Idempotent Resource Management:** Each helper function queries existing resources before creating, matching by name, color, or content prefix to prevent duplicates
- **Axios Instance with Shared Auth:** Centralized API client with base URL, timeout, and a `params()` helper that injects credentials into every request
- **Fail-Loud Error Handling:** Missing credentials trigger an immediate exit with a clear message. API failures surface the Trello error response body, not a generic stack trace.
- **Declarative Card Spec:** Sprint cards are defined as a data structure (title, labels, dependencies, description, checklists, dev notes) and iterated in a single loop — adding a card means adding an object, not writing new API calls
- **Trello Power-Up Connector:** Minimal `index.html` initializing the Trello Power-Up SDK, hosted on Vercel with SPA rewrites for future capability expansion

## Results

**For the Development Team:**

- Sprint 0 board goes from zero to fully provisioned in under 30 seconds
- Every card has the same quality structure — no card is a second-class citizen
- Dependencies are visible and encoded, not tribal knowledge
- Developer notes surface architecture pitfalls at the point of work, not in a separate document
- Board can be torn down and rebuilt identically at any time

**Technical Demonstration:**

- REST API integration with full resource lifecycle management (create, read, update)
- Idempotent automation design — a pattern critical for infrastructure-as-code and CI/CD pipelines
- Data-driven architecture where the card spec is separated from the API execution logic
- Practical project management tooling that bridges the gap between planning and execution
- Environment-based credential management with validation and clear failure modes

This project demonstrates the ability to automate project management infrastructure through APIs, enforce consistent quality standards across a sprint board, and build tooling that is safe to re-run — a core principle in infrastructure automation, CI/CD, and DevOps workflows.
