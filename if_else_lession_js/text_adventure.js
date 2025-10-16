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
    constitution: adventurerLevel,
    gold: 0
};

let orc = {
    level: orcLevel,
    inventory: ["sword", "key", "healthPotion"],
    health: 1 + orcLevel,
    strength: orcLevel,
    charisma: orcLevel,
    constitution: orcLevel,
    gold: 0
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
}

function healDamage(amount) {
    player.health += amount;
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
        if (weaponRoll >= 1) {
            outcomeText = "You defeated the orc!";
            setAdventurerLevel(adventurerLevel + 1);
            player.inventory.push("sword", "key", "health potion");
            player.gold += 100;
            renderPlayer();
        }
    } else if (choice === "talkToOrc") {
        const charismaRoll = diceRoller(player.charisma);
        if (charismaRoll >= 1) {
            outcomeText = "You convince the orc to stand down and give you its treasures!";
            setAdventurerLevel(adventurerLevel + 1);
            player.inventory.push("sword", "key", "health potion");
            player.gold += 100;
            renderPlayer();

        }
    } else if (choice === "breakDownTheDoor") {
        const strengthRoll = diceRoller(player.strength);
        if (strengthRoll >= 1) {
            outcomeText = "You breakdown the door and open the way to the next room!";
        } else {
            outcomeText = "You try to force the door open but it is still closed.";
        }

    } else if (choice === "ignoreFire") {
        const constitutionRoll = diceRoller(player.constitution);
        if (constitutionRoll >= 1) {
            outcomeText = "You open the treasure chest and find a key";
            player.inventory.push("fire Key");
        } else {
            outcomeText = "You are on fire";
        }
    }
    return outcomeText;
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
            takeDamage(5);
            renderPlayer();
            if (player.health <= 0) { return; }
            const backBtn = document.createElement("button");
            backBtn.innerText = "You missed the orc";
            backBtn.addEventListener("click", () => showScene("fightOrcLose"));
            choicesDiv.appendChild(backBtn);
        }
        return;
    }

    if (sceneKey === "breakDownTheDoor") {
        const outcome = handleChoice("breakDownTheDoor");
        choicesDiv.innerHTML = "";

        if (outcome === "You breakdown the door and open the way to the next room!") {
            const backBtn = document.createElement("button");
            backBtn.innerText = "Continue";
            backBtn.addEventListener("click", () => showScene("secondRoomEntrance"));
            choicesDiv.appendChild(backBtn);
        } else {
            const backBtn = document.createElement("button");
            backBtn.innerText = "You try to force the door open but it is still closed.";
            backBtn.addEventListener("click", () => showScene("failToBreakDownDoor"));
            choicesDiv.appendChild(backBtn);
        }
        return;
    }

    if (sceneKey === "ignoreFire") {
        const outcome = handleChoice("ignoreFire");
        choicesDiv.innerHTML = "";
        if (outcome === "You open the treasure chest and find a key") {
            player.inventory.push("key");
            const backBtn = document.createElement("button");
            backBtn.innerText = "Continue";
            backBtn.addEventListener("click", () => showScene("fireChest"));
            choicesDiv.appendChild(backBtn);
        } else {
            const backBtn = document.createElement("button");
            backBtn.innerText = "You are on fire";
            backBtn.addEventListener("click", () => showScene("onFire"));
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
        text: `${player.name}, Your Level: ${player.level}, Your inventory: ${player.inventory.join(", ")}. Your health: ${player.health}. Your strength: ${player.strength}. Your charisma: ${player.charisma}. Game Over.`,
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
            { text: "Fight the orc (roll d20, target 12)", next: "fightOrc" },
            { text: "Talk to the orc", next: "talkToOrc" }
        ]
    },

    fightOrcWin: {
        text: `${player.name}, You have defeated the orc! The orc has a key and sword on them. Inside the chest you find 100 gold. You level has increased to 2`,
        choices: [
            { text: "Return to town", next: "victory" },
            { text: "Continue exploration", next: "continueExploration" }
        ]
    },

    continueExploration: {
        text: `${player.name}, After you defeat the orc a door appears in from of you.`,
        choices: [
            {text: "Try the key on door", next: "tryKeyInDoor"},
            {text: "Break down the door", next: "breakDownTheDoor"},
        ]
    },

    secondRoomEntrance: {
        text: `${player.name}, You look into the room and see a fire in the center of the room.  Inside the fire you see a treasure chest.`,
        choices: [
            { text: "Open the treasure chest", next: "fireChest" },
            { text: "Explore the Room", next: "ExploreRoom" }
        ]
    },

    exploreRoom: {
      text: `${player.name}, You explore the room and find two buttons on the wall.`,
      choices: [
          { text: "Press the right button", next: "pressRightButton" },
          { text: "Press the left button", next: "pressLeftButton" }
      ]
    },

    fireChest: {
        text: `${player.name}, You try to open the treasure chest but it is burning.`,
        choices: [
            { text: "Ignore the fire and try to open the chest anyways", next: "ignoreFire"},
            { text: "Look around the room", next: "exploreRoom" }
        ]
    },

    ignoreFire: {
        text: `${player.name}, You ignore the fire and try to open the treasure chest.`,
        choices: [
            { text: "You open the treasure chest and find a key", next: "keyFound" },
            { text: "You are on fire", next: "onFire" }
        ]
    },

    breakDownTheDoor: {
      text: `${player.name}, You try to force the door open.`,
      choices: [
          { text: "Look into the next room", next: "secondRoomEntrance" },
          { text: "The door is still closed", next: "failToBreakDownDoor"}
      ]
    },

    tryKeyInDoor: {
        text: `${player.name}, You pull the key from your inventory and use it on the door.  Its opens with a click.  The key also disappears from your inventory.`,
        choices: [
            { text: "Look through open door", next: "secondRoomEntrance"},
            { text: "Leave the Cave", next: "victory"}
        ]
    },

    failToBreakDownDoor: {
        text: `${player.name} The door is still closed after you tried to force your way inside`,
        choices: [
            { text: "Try again to force the door open", next: "breakDownTheDoor" },
            { text: "Try the key on the door", next: "tryKeyInDoor" },
            { text: "Give up and return to town with you loot", next: "victory"}
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
            { text: "Game Over", next: "gameOver" }
        ]
    }
};

function startGame() {
    renderPlayer()
    showScene("start");
}

// Start game
startGame();