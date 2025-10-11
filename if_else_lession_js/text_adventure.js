let currentScene = "start";
let adventurerName = prompt("What is your name?");
let adventurerLevel = 1;
let orcLevel = 1;

const gameText = document.getElementById("game_text");
const choicesDiv = document.getElementById("choices");
const playerInfoDiv = document.getElementById("player_info");

let player = {
    level: adventurerLevel,
    name: adventurerName,
    inventory: [],
    health: 10 + adventurerLevel,
    strength: adventurerLevel,
    charisma: adventurerLevel,
    gold: 0
};

let orc = {
    level: orcLevel,
    inventory: ["sword", "key", "healthPotion"],
    health: 1 + orcLevel,
    strength: orcLevel,
    charisma: orcLevel,
}

// Centralized setter to keep the player in sync when the adventurer level changes
function setAdventurerLevel(newLevel) {
    adventurerLevel = newLevel;
    player.level = newLevel;
    player.health = 10 + newLevel;
    player.strength = newLevel;
    player.charisma = newLevel;
    // Re-render player info whenever the level changes
    renderPlayer();
}

function renderPlayer() {
    if (!playerInfoDiv) return;
    const inv = player.inventory.length ? player.inventory.join(", ") : "(empty)";
    playerInfoDiv.innerHTML = `
        <strong>Adventurer:</strong> ${player.name || "Unknown"}<br>
        <strong>Level</strong> ${player.level}<br>
        <strong>Health:</strong> ${player.health}<br>
        <strong>Strength:</strong> ${player.strength}<br>
        <strong>Charisma:</strong> ${player.charisma}<br>
        <strong>Inventory:</strong> ${inv}<br>
        <strong>Gold:</strong> ${player.gold}<br>
    `;
    // End game if health reaches 0
    if (player.health <= 0) {
        showScene("gameOver");
        return;
    }
}

function takeDamage(amount) {
    player.health -= amount;
    renderPlayer();
}

function showScene(sceneKey) {

    const scene = scenes[sceneKey];
    currentScene = sceneKey;

    if (!gameText || !choicesDiv) {
        console.error("Missing required game elements in the DOM.");
        return;
    }

    if (!scene) {
        gameText.innerText = "Scene not found. Returning to start.";
        choicesDiv.innerHTML = "";
        const backBtn = document.createElement("button");
        backBtn.innerText = "Go to Start";
        backBtn.addEventListener("click", () => showScene("start"));
        choicesDiv.appendChild(backBtn);
        return;
    }

    // Handle special scenes with direct outcomes
    if (sceneKey === "fightOrc") {
        const outcome = handleChoice("fightOrc");
        choicesDiv.innerHTML = "";

        if (outcome === "You defeated the orc!") {
            const backBtn = document.createElement("button");
            backBtn.innerText = "Victory";
            backBtn.addEventListener("click", () => showScene("fightOrcWin"));
            choicesDiv.appendChild(backBtn);
        }
        else {
            player.health -= 5
            renderPlayer();
            if (player.health <= 0) { return; }
            const backBtn = document.createElement("button");
            backBtn.innerText = "You missed the orc";
            backBtn.addEventListener("click", () => showScene("fightOrcLose"));
            choicesDiv.appendChild(backBtn);
        }
        return;
    }

    if (sceneKey === "lie") {
        const outcome = handleChoice("persuadeGuildedToPass");
        choicesDiv.innerHTML = "";

        if (outcome === "The guild is swayed by your words and lets you pass.") {
            const backBtn = document.createElement("button");
            backBtn.innerText = "Continue";
            backBtn.addEventListener("click", () => showScene("getRewarded"));
            choicesDiv.appendChild(backBtn);
        } else {

            const backBtn = document.createElement("button");
            backBtn.innerText = "They don't believe you";
            backBtn.addEventListener("click", () => showScene("failedToPersuade"));
            choicesDiv.appendChild(backBtn);
        }
        return;
    }

    // Show regular scenes
    gameText.innerText = scene.text;
    choicesDiv.innerHTML = "";

    // Create buttons for each choice
    (scene.choices || []).forEach(choice => {
        const button = document.createElement("button");
        button.innerText = choice.text;
        button.addEventListener("click", () => showScene(choice.next));
        choicesDiv.appendChild(button);
    });
}

function diceRoller(bonus = 0) {
    return Math.floor(Math.random() * 20) + 1 + bonus;
}

function handleChoice(choice) {
    let outcomeText = "";

    if (choice === "persuadeGuildedToPass") {
        const charismaRoll = diceRoller(player.charisma);
        if (charismaRoll >= 18) {
            player.gold += 25;
            setAdventurerLevel( adventurerLevel + 1);
            outcomeText = "The guild is swayed by your words and lets you pass.";
        } else {
            outcomeText = "The guild looks unconvinced and they look on you with dismay.";
        }
    } else if (choice === "fightOrc") {
        const weaponRoll = diceRoller(player.strength);
        if (weaponRoll >= 5) {
            outcomeText = "You defeated the orc!";
            setAdventurerLevel(adventurerLevel + 1);
            player.inventory.push("sword", "key", "health potion");
            player.gold += 100;
            renderPlayer();
        }
        else if (choice === "fightOrc" && player.charisma <= 0) {
            gameText.innerText = "Your adventurer has come to a end.";
            choicesDiv.innerHTML = "";
            const backBtn = document.createElement("button");
            backBtn.innerText = "Game Over";
            backBtn.addEventListener("click", () => showScene("gameOver"));
            choicesDiv.appendChild(backBtn);
            return;
        }
    }
    return outcomeText;
}

const scenes = {
    start: {
        text: `${player.name}, After walking for some time you see a cave in the distance.`,
        choices: [
            { text: "Enter the cave", next: "enterCave" },
            { text: "Run back to town", next: "runToTown" }
        ]
    },

    runToTown: {
        text: `${player.name}, You return to the gates of the town after running away.`,
        choices: [
            { text: "Head back to adventurers guild", next: "guild" },
            { text: "Keep running", next: "runAway" }
        ]
    },

    guild: {
        text: `${player.name}, You make your way to the adventurer's guild.  They are very friendly and helpful. They are concerned you are back so soon.`,
        choices: [
            { text: "Tell them truth", next: "truth" },
            { text: "Lie and say you completed the job", next: "lie" }
        ]
    },

    truth: {
        text: `${player.name}, You tell them you were too afraid to enter the cave.  The adventurers look on you with dismay. They give you a choice.  You can quit and fail the adventures test or you can go back and complete the job.`,
        choices: [
            { text: "Quit", next: "newJob" },
            { text: "Return to the cave", next: "start" }
        ]
    },

    lie: {
        text: `${player.name}, You lie and say you completed the job.`,
        choices: [
            { text: "Persuade the guild to pass", next: "getRewarded" },
            { text: "They don't believe you", next: "failedToPersuade" }
        ]
    },

    failedToPersuade: {
        text: `${player.name}, The guild looks unconvinced and they look on you with dismay.`,
        choices: [
            { text: "You are caught in a lie and they kick you out of the adventure guild.", next: "gameOver" }
        ]
    },

    getRewarded: {
        text: `${player.name}, You have completed the job and are rewarded with 25 gold coins.  You are now an adventurer.`,
        choices: [
            { text: "Game Over", next: "gameOver" }
        ]
    },

    runAway: {
        text: `${player.name}, You keep running past the town and off into the distance.  You have changed your mind about being an adventurer.`,
        choices: [
            { text: "Game Over", next: "gameOver" }
        ]
    },

    newJob: {
        text: `${player.name}, You decided not to become an adventurer.`,
        choices: [
            { text: "Game Over", next: "gameOver" }
        ]
    },

    gameOver: {
        text: `${player.name}, Game Over.`,
        choices: [
            { text: "End Game Stats", next: "endGameStats" }
        ]
    },

    endGameStats: {
        text: `${player.name}, Your inventory: ${player.inventory.join(", ")}. Your health: ${player.health}. Your strength: ${player.strength}. Your charisma: ${player.charisma}. Game Over.`,
        choices: []
    },

    enterCave: {
        text: `${player.name}, You enter the cave and find an orc guarding a chest.`,
        choices: [
            { text: "Fight the orc", next: "fightOrc" },
            { text: "Run back to town", next: "runToTown" }
        ]
    },

    fightOrc: {
        text: `${player.name}, You attempt to fight the orc.`,
        choices: [
            { text: "Fight the orc (roll d20, target 12)", next: "fightOrc" }
        ]
    },

    fightOrcWin: {
        text: `${player.name}, You have defeated the orc! The orc has a key and sword on them. Inside the chest you find 100 gold. You level has increased to 2`,
        choices: [
            { text: "Return to town", next: "victory" }
        ]
    },

    fightOrcLose: {
        text: `${player.name}, The orc scares you off and you flee back to the cave entrance.`,
        choices: [
            { text: "Catch your breath and go back in", next: "enterCave" },
            { text: "Return to town", next: "runToTown" }
        ]
    },

    victory: {
        text: `${player.name}, You have defeated the orc and open the treasure chest. You return to the adventures guild victorious!  You are now an adventurer!`,
        choices: [
            { text: "Game Over", next: "start" }
        ]
    }
};

function startGame() {
    renderPlayer()
    showScene("start");
}

// Start game
startGame();