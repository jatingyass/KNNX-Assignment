const readlineSync = require("readline-sync");

// ===============================
// Player Class
// ===============================
class Player {
    constructor() {
        this.name = "Unknown Warrior";
        this.score = 0;
    }

    showScore() {
        console.log("Your current score: " + this.score);
    }
}

// ===============================
// Question Class
// ===============================
class Question {
    constructor(text, category, difficulty, answer) {
        this.questionText = text;
        this.category = category;
        this.difficulty = difficulty;
        this.correctAnswer = answer;
    }
}

// ===============================
// QuizMaster Class
// ===============================
class QuizMaster {
    constructor() {
        this.questions = [];
        this.player = new Player();
        this.selectedCategory = "";
        this.selectedDifficulty = "";
        this.questionCount = 0;
        this.MAX_QUESTIONS = 5; // Only 5 questions per quiz
    }

    start() {
        console.log("\nWelcome to *Quiz Master* — where knowledge meets sarcasm!\n");

        this.player.name = readlineSync.question("Enter your name, brave human: ");

        this.chooseCategory();
        this.chooseDifficulty();

        console.log(`\nGenerating your quiz on ${this.selectedCategory} (${this.selectedDifficulty})...\n`);

        const quizPool = this.getFilteredQuestions();

        // Shuffle questions & take first 5
        const selected = quizPool.sort(() => Math.random() - 0.5).slice(0, this.MAX_QUESTIONS);

        for (let q of selected) {
            this.askQuestion(q);
            this.questionCount++;
        }

        this.endGame();
    }

    chooseCategory() {
        console.log("\nChoose a category: Science / History / FunFacts");
        let cat = readlineSync.question("Category: ");

        if (["Science", "History", "FunFacts"].includes(cat)) {
            this.selectedCategory = cat;
        } else {
            console.log("Invalid category. Defaulting to Science.");
            this.selectedCategory = "Science";
        }
    }

    chooseDifficulty() {
        console.log("\nChoose difficulty: Easy / Medium / Hard");
        let diff = readlineSync.question("Difficulty: ");

        if (["Easy", "Medium", "Hard"].includes(diff)) {
            this.selectedDifficulty = diff;
        } else {
            console.log("Invalid choice. Defaulting to Easy.");
            this.selectedDifficulty = "Easy";
        }
    }

    getFilteredQuestions() {
        let pool = this.questions.filter(
            (q) =>
                q.category === this.selectedCategory &&
                q.difficulty === this.selectedDifficulty
        );

        if (pool.length < 5) {
            console.log("\nNot enough questions! Adding pity points +10.\n");
            this.player.score += 10;
        }

        return pool;
    }

    askQuestion(q) {
        console.log(`Q${this.questionCount + 1}: ${q.questionText}`);
        let ans = readlineSync.question("Your answer: ");

        this.evaluateAnswer(q, ans);
        this.player.showScore();
        console.log("---------------------------------");
    }

    evaluateAnswer(q, ans) {
        if (ans.toLowerCase() === q.correctAnswer.toLowerCase()) {
            this.commentOnAnswer(true);
            this.applyScore(q.difficulty, true);
        } else {
            this.commentOnAnswer(false);
            this.applyScore(q.difficulty, false);
        }
    }

    applyScore(diff, isCorrect) {
        if (diff === "Easy") {
            this.player.score += isCorrect ? 5 : -2;
        } else if (diff === "Medium") {
            this.player.score += isCorrect ? 10 : -5;
        } else if (diff === "Hard") {
            this.player.score += isCorrect ? 15 : -7;
        }
    }

    commentOnAnswer(isCorrect) {
        if (isCorrect) {
            console.log("Well, someone paid attention in school!");
        } else {
            console.log("Close… if we were grading on imagination.");
        }
    }

    endGame() {
        console.log("\n============ QUIZ OVER ============\n");
        console.log("Final Score: " + this.player.score);

        if (this.player.score >= 60) {
            console.log("🔥 Quiz Royalty has arrived!");
        } else if (this.player.score >= 30) {
            console.log("👍 Quiz Master in training.");
        } else {
            console.log("😂 Better luck next time, genius.");
        }

        console.log("Thanks for playing, " + this.player.name + "!\n");
    }
}

// ===============================
// ADDING 45 QUESTIONS (5 each category & difficulty)
// ===============================

let quiz = new QuizMaster();

// SCIENCE — EASY
quiz.questions.push(new Question("What is the symbol for water?", "Science", "Easy", "H2O"));
quiz.questions.push(new Question("What gas do plants breathe in?", "Science", "Easy", "Carbon Dioxide"));
quiz.questions.push(new Question("What star is closest to Earth?", "Science", "Easy", "Sun"));
quiz.questions.push(new Question("What planet is blue?", "Science", "Easy", "Earth"));
quiz.questions.push(new Question("How many legs do insects have?", "Science", "Easy", "6"));

// SCIENCE — MEDIUM
quiz.questions.push(new Question("What planet is known as the Red Planet?", "Science", "Medium", "Mars"));
quiz.questions.push(new Question("What gas do humans need to breathe?", "Science", "Medium", "Oxygen"));
quiz.questions.push(new Question("Human body has how many bones?", "Science", "Medium", "206"));
quiz.questions.push(new Question("What is the speed of light?", "Science", "Medium", "300000 km/s"));
quiz.questions.push(new Question("What force keeps us on Earth?", "Science", "Medium", "Gravity"));

// SCIENCE — HARD
quiz.questions.push(new Question("What particle has a negative charge?", "Science", "Hard", "Electron"));
quiz.questions.push(new Question("What is the heaviest naturally occurring element?", "Science", "Hard", "Uranium"));
quiz.questions.push(new Question("What is the powerhouse of the cell?", "Science", "Hard", "Mitochondria"));
quiz.questions.push(new Question("What is Newton’s 3rd law?", "Science", "Hard", "Every action has an equal and opposite reaction"));
quiz.questions.push(new Question("What is the hardest natural substance?", "Science", "Hard", "Diamond"));

// HISTORY — EASY
quiz.questions.push(new Question("Who discovered America?", "History", "Easy", "Christopher Columbus"));
quiz.questions.push(new Question("Who was the first President of the USA?", "History", "Easy", "George Washington"));
quiz.questions.push(new Question("Which country built the Great Wall?", "History", "Easy", "China"));
quiz.questions.push(new Question("Who invented the light bulb?", "History", "Easy", "Thomas Edison"));
quiz.questions.push(new Question("Who was the first man on the moon?", "History", "Easy", "Neil Armstrong"));

// HISTORY — MEDIUM
quiz.questions.push(new Question("When did World War II end?", "History", "Medium", "1945"));
quiz.questions.push(new Question("Who was known as Iron Lady?", "History", "Medium", "Margaret Thatcher"));
quiz.questions.push(new Question("Which empire built Machu Picchu?", "History", "Medium", "Inca"));
quiz.questions.push(new Question("Who was the first Mughal Emperor of India?", "History", "Medium", "Babur"));
quiz.questions.push(new Question("Who wrote the Constitution of India?", "History", "Medium", "BR Ambedkar"));

// HISTORY — HARD
quiz.questions.push(new Question("Who discovered penicillin?", "History", "Hard", "Alexander Fleming"));
quiz.questions.push(new Question("When did the Roman Empire fall?", "History", "Hard", "476 AD"));
quiz.questions.push(new Question("When was the Battle of Hastings?", "History", "Hard", "1066"));
quiz.questions.push(new Question("Who was Cleopatra?", "History", "Hard", "Queen of Egypt"));
quiz.questions.push(new Question("Who was the last Tsar of Russia?", "History", "Hard", "Nicholas II"));

// FUN FACTS — EASY
quiz.questions.push(new Question("Which animal says meow?", "FunFacts", "Easy", "Cat"));
quiz.questions.push(new Question("Which animal barks?", "FunFacts", "Easy", "Dog"));
quiz.questions.push(new Question("What is the tallest mammal?", "FunFacts", "Easy", "Giraffe"));
quiz.questions.push(new Question("Which food is yellow and curved?", "FunFacts", "Easy", "Banana"));
quiz.questions.push(new Question("Which animal can fly?", "FunFacts", "Easy", "Bird"));

// FUN FACTS — MEDIUM
quiz.questions.push(new Question("Which animal sleeps 18 hours a day?", "FunFacts", "Medium", "Koala"));
quiz.questions.push(new Question("What fruit has its seeds on the outside?", "FunFacts", "Medium", "Strawberry"));
quiz.questions.push(new Question("Which animal has 3 hearts?", "FunFacts", "Medium", "Octopus"));
quiz.questions.push(new Question("What is the fastest bird?", "FunFacts", "Medium", "Peregrine Falcon"));
quiz.questions.push(new Question("What is the only mammal that can fly?", "FunFacts", "Medium", "Bat"));

// FUN FACTS — HARD
quiz.questions.push(new Question("What animal cannot jump?", "FunFacts", "Hard", "Elephant"));
quiz.questions.push(new Question("What is the rarest blood type?", "FunFacts", "Hard", "AB Negative"));
quiz.questions.push(new Question("What is the only food that never spoils?", "FunFacts", "Hard", "Honey"));
quiz.questions.push(new Question("What country has the most pyramids?", "FunFacts", "Hard", "Sudan"));
quiz.questions.push(new Question("What is largest ocean?", "FunFacts", "Hard", "Pacific"));

// ===============================
// START QUIZ
// ===============================
quiz.start();
