// ----------------------------
// Player Class
// ----------------------------
class Player {
    constructor() {
        this.name = "Unnamed Hero";
        this.inventory = [];
        this.currentRoom = null;
        this.isAlive = true;
    }

    pickUp(item) {
        this.inventory.push(item);
        console.log(`You picked up the ${item}. Confidence level +10.`);
    }

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

    showInventory() {
        if (this.inventory.length === 0) {
            console.log("Your pockets are empty. Your soul probably too.");
        } else {
            console.log("You currently carry: " + this.inventory.join(", "));
        }
    }
}


// ----------------------------
// Room Class
// ----------------------------
class Room {
    constructor() {
        this.name = "";
        this.description = "";
        this.items = [];
        this.exits = {};
        this.solved = false;
    }

    showDetails() {
        console.log(`---- ${this.name} ----`);
        console.log(this.description);

        if (this.items.length > 0) {
            console.log("Items here: " + this.items.join(", "));
        } else {
            console.log("Nothing interesting. Just disappointment.");
        }
    }

    interact() {
        if (this.name === "Locked Door Room" && !this.solved) {
            if (GameManager.player.inventory.includes("rusty key")) {
                console.log("You unlock the door with the rusty key. The door sighs in relief.");
                this.solved = true;
                this.exits["east"] = "Treasure Room";
            } else {
                console.log("The door stares at you blankly. Perhaps it's missing something — like a key?");
            }
        }

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


// ----------------------------
// Game Manager
// ----------------------------
const GameManager = {
    rooms: {},
    player: new Player(),

    startGame() {
        console.log("Welcome to the Mysterious Land of KN-Lang!");
        this.setupRooms();

        this.player.currentRoom = this.rooms["Entrance"];
        this.player.currentRoom.showDetails();

        const readlineSync = require("readline-sync");

        while (this.player.isAlive) {
            let command = readlineSync.question(">> ");
            this.handleCommand(command);
        }
    },

    handleCommand(cmd) {
        const parts = cmd.split(" ");

        // -----------------------------
        // go <direction>
        // -----------------------------
        if (parts[0] === "go") {
            this.player.move(parts[1]);
        }

        // -----------------------------
        // pick <item name>
        // -----------------------------
        else if (parts[0] === "pick") {
            let item = parts.slice(1).join(" "); // handles multi-word items
            let room = this.player.currentRoom;

            if (room.items.includes(item)) {
                this.player.pickUp(item);
                room.items = room.items.filter(i => i !== item);
            } else {
                console.log("You can't pick that. It's imaginary.");
            }
        }

        // -----------------------------
        // look
        // -----------------------------
        else if (parts[0] === "look") {
            this.player.currentRoom.showDetails();
        }

        // -----------------------------
        // inventory
        // -----------------------------
        else if (parts[0] === "inventory") {
            this.player.showInventory();
        }

        // -----------------------------
        // interact
        // -----------------------------
        else if (parts[0] === "interact") {
            this.player.currentRoom.interact();
        }

        // -----------------------------
        // quit
        // -----------------------------
        else if (parts[0] === "quit") {
            this.player.isAlive = false;
            console.log("You exit the game. The world cries softly.");
        }

        // -----------------------------
        // invalid
        // -----------------------------
        else {
            console.log("Invalid command. Your brain might need debugging.");
        }
    },

    setupRooms() {
        // Entrance Room
        let entrance = new Room();
        entrance.name = "Entrance";
        entrance.description = "You wake up in a weird room. Smells like deadlines.";
        entrance.exits = { north: "Spooky Dungeon", east: "Riddle Room" };
        this.rooms["Entrance"] = entrance;

        // Spooky Dungeon
        let dungeon = new Room();
        dungeon.name = "Spooky Dungeon";
        dungeon.description = "Damp walls, moldy smell, and a distant snore...";
        dungeon.items.push("rusty key");
        dungeon.exits = { south: "Entrance", west: "Locked Door Room" };
        this.rooms["Spooky Dungeon"] = dungeon;

        // Locked Door Room
        let locked = new Room();
        locked.name = "Locked Door Room";
        locked.description = "A giant locked door blocks your way.";
        locked.exits = { east: "Spooky Dungeon" };
        this.rooms["Locked Door Room"] = locked;

        // Riddle Room
        let riddle = new Room();
        riddle.name = "Riddle Room";
        riddle.description = "A glowing tablet floats mysteriously.";
        riddle.exits = { west: "Entrance" };
        this.rooms["Riddle Room"] = riddle;

        // Treasure Room
        let treasure = new Room();
        treasure.name = "Treasure Room";
        treasure.description = "You found the treasure! Also free snacks.";
        treasure.items.push("golden trophy");
        this.rooms["Treasure Room"] = treasure;
    }
};


// ----------------------------
// START GAME
// ----------------------------
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
