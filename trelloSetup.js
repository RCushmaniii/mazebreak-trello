require("dotenv").config();
const axios = require("axios");

const TRELLO_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

const BASE_URL = "https://api.trello.com/1";

async function createWorkspace() {
    const response = await axios.post(`${BASE_URL}/organizations`, null, {
        params: {
            displayName: "MazeBreak Development",
            desc: "Workspace for MazeBreak Roblox game development",
            key: TRELLO_KEY,
            token: TRELLO_TOKEN
        }
    });

    console.log("Workspace Created:", response.data.id);
    return response.data.id;
}

async function createBoard(workspaceId) {
    const response = await axios.post(`${BASE_URL}/boards/`, null, {
        params: {
            name: "MazeBreak – Core Development",
            idOrganization: workspaceId,
            defaultLists: false,
            key: TRELLO_KEY,
            token: TRELLO_TOKEN
        }
    });

    console.log("Board Created:", response.data.id);
    return response.data.id;
}

async function createList(boardId, name) {
    const response = await axios.post(`${BASE_URL}/lists`, null, {
        params: {
            name,
            idBoard: boardId,
            key: TRELLO_KEY,
            token: TRELLO_TOKEN
        }
    });

    console.log("List Created:", name);
    return response.data.id;
}

async function createLabel(boardId, name, color) {
    await axios.post(`${BASE_URL}/labels`, null, {
        params: {
            name,
            color,
            idBoard: boardId,
            key: TRELLO_KEY,
            token: TRELLO_TOKEN
        }
    });

    console.log("Label Created:", name);
}

async function createCard(listId, name, desc) {
    await axios.post(`${BASE_URL}/cards`, null, {
        params: {
            name,
            desc,
            idList: listId,
            key: TRELLO_KEY,
            token: TRELLO_TOKEN
        }
    });

    console.log("Card Created:", name);
}

async function main() {
    const workspaceId = await createWorkspace();
    const boardId = await createBoard(workspaceId);

    const sprint0List = await createList(boardId, "🧪 Sprint 0 – Combat Prototype");
    await createList(boardId, "🔜 Sprint 1 – Core Loop");
    await createList(boardId, "📦 Backlog");
    await createList(boardId, "✅ Done");

    // Labels
    await createLabel(boardId, "Architecture", "purple");
    await createLabel(boardId, "Client", "blue");
    await createLabel(boardId, "Server", "red");
    await createLabel(boardId, "Combat", "orange");
    await createLabel(boardId, "Enemy", "green");
    await createLabel(boardId, "UI", "yellow");
    await createLabel(boardId, "Polish", "pink");
    await createLabel(boardId, "Critical", "black");

    // Sprint 0 Cards
    await createCard(sprint0List, "CARD 1 – Project Foundation Setup", "Clean architecture before gameplay logic.");
    await createCard(sprint0List, "CARD 2 – Player Movement & Input", "Responsive movement and attack input.");
    await createCard(sprint0List, "CARD 3 – CombatManager (Server)", "Server-authoritative damage validation.");
    await createCard(sprint0List, "CARD 4 – DamageResolver System", "Centralized damage system.");
    await createCard(sprint0List, "CARD 5 – Enemy: Zombie (Tier 1)", "Single functional enemy with telegraphing.");
    await createCard(sprint0List, "CARD 6 – Health System", "Health, damage reaction, and death logic.");
    await createCard(sprint0List, "CARD 7 – Basic HUD", "Health bar UI reflecting server state.");
    await createCard(sprint0List, "CARD 8 – Feel Tuning Pass", "Iterate and refine combat feel.");

    console.log("MazeBreak Sprint 0 Board Setup Complete.");
}

main();
