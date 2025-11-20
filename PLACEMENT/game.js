// ============================================================
// Player Class — keeps track of the player's journey and mistakes
// ============================================================
class Player {
    constructor() {
        // Name of the brave explorer (or victim)
        this.name = "Unnamed Hero";

        // Items the player shamelessly collects
        this.inventory = [];

        // The room where the player currently exists (physically or mentally)
        this.currentRoom = null;

        // Controls whether the game loop should keep running
        this.isAlive = true;
    }

    // Adds an item to player's pockets, boosting imaginary confidence
    pickUp(item) {
        this.inventory.push(item);
        console.log(`You picked up the ${item}. Confidence level +10.`);
    }

    // Moves player into a room, unless the player prefers hitting walls
    move(direction) {
        const room = this.currentRoom;

        if (room.exits[direction]) {
            this.currentRoom = GameManager.rooms[room.exits[direction]];
            console.log(`You walk ${direction} like a majestic pigeon...`);
            this.currentRoom.showDetails();
        } else {
            console.log("You bump into a wall. The wall does not apologize.");
        }
    }

    // Shows everything the player is hoarding so far
    showInventory() {
        if (this.inventory.length === 0) {
            console.log("Your pockets are empty. Your soul probably too.");
        } else {
            console.log("You currently carry: " + this.inventory.join(", "));
        }
    }
}



// ============================================================
// Room Class — defines physical spaces and their quirky behaviour
// ============================================================
class Room {
    constructor() {
        this.name = "";
        this.description = "";
        this.items = [];      // Objects lying around for the player to steal
        this.exits = {};      // Map of directions → next room
        this.solved = false;  // For puzzles that require solving
    }

    // Prints what the room looks like and what loot is inside
    showDetails() {
        console.log(`---- ${this.name} ----`);
        console.log(this.description);

        if (this.items.length > 0) {
            console.log("Items here: " + this.items.join(", "));
        } else {
            console.log("Nothing interesting. Just disappointment.");
        }
    }

    // Handles puzzles inside specific rooms
    interact() {
        // Puzzle #1 — Locked Door
        if (this.name === "Locked Door Room" && !this.solved) {
            if (GameManager.player.inventory.includes("rusty key")) {
                console.log("You unlock the door with the rusty key. The door sighs in relief.");
                this.solved = true;
                this.exits["east"] = "Treasure Room"; // New path unlocked
            } else {
                console.log("The door stares at you blankly. Maybe bring a key?");
            }
        }

        // Puzzle #2 — Riddle Room
        if (this.name === "Riddle Room" && !this.solved) {
            console.log("A stone tablet asks: 'What has keys but can't open locks?'");

            const readlineSync = require("readline-sync");
            let ans = readlineSync.question("Your answer: ");

            if (ans.toLowerCase() === "piano") {
                console.log("Correct! A hidden passage opens.");
                this.solved = true;
                this.exits["north"] = "Treasure Room";
            } else {
                console.log("Wrong! The tablet laughs at your IQ.");
            }
        }
    }
}



// ============================================================
// GameManager — the mastermind controlling everything
// ============================================================
const GameManager = {
    rooms: {},
    player: new Player(),

    // Starts the entire adventure
    startGame() {
        console.log("Welcome to the Mysterious Land of KN-Lang!");
        this.setupRooms();

        // Begin journey from the Entrance
        this.player.currentRoom = this.rooms["Entrance"];
        this.player.currentRoom.showDetails();

        const readlineSync = require("readline-sync");

        // Main command loop — runs until player quits or rage quits
        while (this.player.isAlive) {
            let command = readlineSync.question(">> ");
            this.handleCommand(command);
        }
    },

    // Decides what action to take based on user input
    handleCommand(cmd) {
        const parts = cmd.split(" ");

        if (parts[0] === "go") {
            this.player.move(parts[1]);
        }

        // Allows picking multi-word items like "rusty key"
        else if (parts[0] === "pick") {
            let item = parts.slice(1).join(" ");
            let room = this.player.currentRoom;

            if (room.items.includes(item)) {
                this.player.pickUp(item);
                room.items = room.items.filter(i => i !== item);
            } else {
                console.log("You can't pick that. It's imaginary.");
            }
        }

        else if (parts[0] === "look") {
            this.player.currentRoom.showDetails();
        }

        else if (parts[0] === "inventory") {
            this.player.showInventory();
        }

        else if (parts[0] === "interact") {
            this.player.currentRoom.interact();
        }

        else if (parts[0] === "quit") {
            this.player.isAlive = false;
            console.log("You exit the game. The world cries softly.");
        }

        else {
            console.log("Invalid command. Your brain might need debugging.");
        }
    },

    // Creates all the rooms and links them together
    setupRooms() {
        // Entrance Room
        let entrance = new Room();
        entrance.name = "Entrance";
        entrance.description = "You wake up in a weird room. Smells like deadlines.";
        entrance.exits = { north: "Spooky Dungeon", east: "Riddle Room" };
        this.rooms["Entrance"] = entrance;

        // Dungeon — contains a key that you better pick up
        let dungeon = new Room();
        dungeon.name = "Spooky Dungeon";
        dungeon.description = "Damp walls, moldy smell, and a distant snore...";
        dungeon.items.push("rusty key");
        dungeon.exits = { south: "Entrance", west: "Locked Door Room" };
        this.rooms["Spooky Dungeon"] = dungeon;

        // Locked Door — requires key (obviously)
        let locked = new Room();
        locked.name = "Locked Door Room";
        locked.description = "A giant locked door blocks your way.";
        locked.exits = { east: "Spooky Dungeon" };
        this.rooms["Locked Door Room"] = locked;

        // Riddle Room — where IQ is tested
        let riddle = new Room();
        riddle.name = "Riddle Room";
        riddle.description = "A glowing tablet floats mysteriously.";
        riddle.exits = { west: "Entrance" };
        this.rooms["Riddle Room"] = riddle;

        // Treasure Room — the reward for dealing with all the nonsense
        let treasure = new Room();
        treasure.name = "Treasure Room";
        treasure.description = "You found the treasure! Also free snacks.";
        treasure.items.push("golden trophy");
        this.rooms["Treasure Room"] = treasure;
    }
};


// Start everything
GameManager.startGame();






// game cmds

// look
// go east
// look
// interact
// keyboard
// interact
// piano
// look
// go north
// look
// pick golden trophy
// inventory
// quit
