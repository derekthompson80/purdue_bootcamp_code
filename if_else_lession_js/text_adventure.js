let currentScene =  "start";
let adventurerName = prompt("What is your name?");
let adventurerLevel = 1;

const gameText = document.getElementById("game_text");
const choicesDiv = document.getElementById("choices");
const playerInfoDiv = document.getElementById("player_info");

let player = {
        level: adventurerLevel,
        name: adventurerName, // The player's name
        inventory: [], // An array to hold items the player is carrying
        health: 10 + adventurerLevel, // Player's health points
        strength: adventurerLevel, // Player's strength for combat or actions
        charisma: adventurerLevel,
        gold: 0,

        // Add other relevant properties like 'gold', 'statusEffects', etc.
};

// Initial render of player info
renderPlayer?.();

function renderPlayer() {
    if (!playerInfoDiv) return;
    const inv = player.inventory.length ? player.inventory.join(", ") : "(empty)";
    playerInfoDiv.innerHTML = `
        <strong>Adventurer:</strong> ${player.name || "Unknown"}<br>
        <strong>Health:</strong> ${player.health}<br>
        <strong>Strength:</strong> ${player.strength}<br>
        <strong>Charisma:</strong> ${player.charisma}<br>
        <strong>Inventory:</strong> ${inv}
        <strong>Gold:</strong> ${player.gold}<br>
    `;
    // Ensure the game ends if health reaches 0, even if health changed outside takeDamage()
}

function playerHealthIsZero() {
     if (player.health === 0 && currentScene !== "gameOver") {
        player.health = 0; // normalize to 0
        return showScene("gameOver");
    }
}

// Method to add an item to the player's inventory
function pickupItem(item) {
    player.inventory.push(item);
    renderPlayer();
}

// Method to remove an item from the player's inventory
function dropItem(item) {
    const itemIndex = player.inventory.indexOf(item);
    if (itemIndex > -1) {
      player.inventory.splice(itemIndex, 1);
      renderPlayer();
      return true; // Item successfully dropped
    }
    return false; // Item not found
}

// Method to take damage
function takeDamage(amount) {
    player.health -= amount;
    if (player.health === 0) {
      player.health = 0;
      renderPlayer();
      showScene("gameOver");
      return;
    }
    renderPlayer();
}

// Method to heal
function heal(amount) {
    player.health += amount;
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

  if (sceneKey === "gameOver") {
      renderPlayer();
      gameText.innerText = "Game Over.";
      choicesDiv.innerHTML = "";
      const backBtn = document.createElement("button");
      backBtn.innerText = "End Game Stats";
      backBtn.addEventListener("click", () => showScene("endGameStats"));
      choicesDiv.appendChild(backBtn);
      return;
  }

  if (sceneKey === "fightOrc") {
      renderPlayer();
      const rollOutCome = gameText.innerText = handleChoice("fightOrc");
      choicesDiv.innerHTML = "";
      if (rollOutCome === "You successfully hit the orc!") {
          const backBtn = document.createElement("button");
          backBtn.innerText = "Victory";
          backBtn.addEventListener("click", () => showScene("fightOrcWin"));
          choicesDiv.appendChild(backBtn);
      } else {

          const backBtn = document.createElement("button");
          backBtn.innerText = "You missed the orc";
          backBtn.addEventListener("click", () => showScene("fightOrcLose"));
          choicesDiv.appendChild(backBtn);
      }
      renderPlayer();
      return;
  }

  if (sceneKey === "lie") {

      const rollOutCome = gameText.innerText = handleChoice("persuadeGuildedToPass");
      choicesDiv.innerHTML = "";
      if (rollOutCome === "The guild is swayed by your words and lets you pass.") {
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
      renderPlayer();
      return;
  }

  // Show scene text
  gameText.innerText = scene.text;

  // Clear old choices
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
    const rollResult = Math.floor(Math.random() * 20) + 1; // d20 roll in range 1-20
    return rollResult + bonus;
}


function handleChoice(choice) {
    let outcomeText = "";
    renderPlayer();

    if (choice === "attempt_to_open_door") {
        const strengthRoll = diceRoller(player.strength); // Roll a d20
        if (strengthRoll >= 4) { // Assuming a DC of 4 to open the door
            outcomeText = "You successfully force open the door!";
            // Update game state, move to a new location, etc.
        } else {
            outcomeText = "The door remains stubbornly shut.";
        }
    } else if (choice === "persuadeGuildedToPass") {
        const charismaRoll = diceRoller(player.charisma); // Roll a d20 for persuasion
        if (charismaRoll >= 18) { // Assuming a DC of 15
            outcomeText = "The guild is swayed by your words you pass the test and are rewarded with 25 gold coins.";
        } else {
                outcomeText = "The guild looks unconvinced and they look on you with dismay.";
        }
    } else if (choice === "fightOrc") {
        const weaponRoll = diceRoller(player.strength);
        if (weaponRoll >= 22) {
            outcomeText = "You successfully hit the orc!";
            player.level += 2;
            player.inventory.push( "sword", "key", "health potion");
            player.gold += 100;
            
        } else {
            takeDamage(5);
            outcomeText = "Your attack did not hit the orc!";
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

  lie:{
    text: `${player.name}, You lie and say you completed the job.`,
    choices: [
      { text: "persuadeGuildedToPass", next: "getRewarded" },
      { text: "They don't believe you", next: "failedToPersuade"}
    ]
  },

  failedToPersuade: {
    text: `${player.name}, The guild looks unconvinced and they look on you with dismay.`,
    choices: [
        { text: "You are caught in a lie and they kick you out of the adventure guild.", next: "gameOver" },
    ]
  },
    
  getRewarded: {
    text: `${player.name}, You have completed the job and are rewarded with 25 gold coins.  You are now an adventurer.`,
    choices: [
        { text: "Game Over", next: "start" },
    ]
  },

  runAway: {
    text: `${player.name}, You keep running past the town and off into the distance.  You have changed your mind about being an adventurer.`,
    choices: [
        { text: "Game Over", next: "gameOver" },
    ]
  },

  newJob: {
    text: `${player.name}, You decided not to become an adventurer.`,
    choices: [
        { text: "Game Over", next: "gameOver" },
    ]
  },

  gameOver: {
    text: `${player.name}, Game Over.`,
    choices: [
        { text: "Game Over", next: "endGameStats" },
    ]
  },

  endGameStats: {
      text: `${player.name}, Your inventory: ${player.inventory.join(", ")}. Your health: ${player.health}. Your strength: ${player.strength}. Your charisma: ${player.charisma}. Game Over.`,
  },

  enterCave: {
    text: `${player.name}, You enter the cave and find an orc guarding a chest.`,
    choices: [
      { text: "Fight the orc", next: "fightOrc"},
      { text: "Run back to town", next: "runToTown" }
    ]
  },

  fightOrc: {
      text: `${player.name}, You attempt to fight the orc.`,
      choices: [
          { text: "Fight the orc (roll d20, target 12)", next: "fightOrc"},
      ]
  },
  fightOrcWin: {
    text: `${player.name}, You have defeated the orc! THe orc has a key and sword on them. Inside the chest you find 100 gold.`,
    choices: [
      { text: "Return to town", next: "victory" },
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
        { text: "Game Over", next: "start" },
    ]
  }
};

// Start game
showScene("start");




