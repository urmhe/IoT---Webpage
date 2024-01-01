import {Countdown} from './countdown.js';

/* This class implements the entire functionality and game logic of the ColorGame */ 
export class ColorGame {

    // countdown object to track remaining time
    #countdown;
    // initial seconds used for the countdown
    #initialTimeSeconds = 30;

    // setInterval() object that periodically reduces the countdown
    #timer;

    // shows if game is active or not
    #gameActive;
    // current score of the player
    #score;

    // the type of prompt
    // this is important for checking whether gameInput will result in success or failure
    #prompt_type;

    // this determines the text that is used for the prompt
    #prompt_text_type;
    // this is the color that the color_text will have in the prompt
    #prompt_color;
    // this is the text of a color that is used in the prompt
    #prompt_color_text;

    // map all color_text values to a corresponding rgb value
    #colorMap = new Map([
        ['red',"rgb(201, 2, 52)"],
        ['green', "rgb(2, 217, 67)"],
        ['blue', "rgb(2, 129, 232)"]
    ]);

    constructor () {
        this.#gameActive = false;
        this.#score = 0;
    }

    /* Generate a random int within the range [floor, ceiling] and return it. */
    #generateNumBetween(floor, ceiling) {
        let min = Math.ceil(floor);
        let max = Math.floor(ceiling);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /* Generate a new game prompt and update the html accordingly */
    #updatePrompt() {
        // get all keys into array
        let keys = Array.from(this.#colorMap.keys())

        // randomise next prompt
        this.#prompt_color = keys[this.#generateNumBetween(0, 2)];
        this.#prompt_color_text = keys[this.#generateNumBetween(0, 2)];
        this.#prompt_text_type = this.#generateNumBetween(1, 2);

        if (this.#prompt_color == this.#prompt_color_text) {
            // if text color and text are the same then special rule applies --> type 3
            this.#prompt_type = 3;
        } else {
            // either type 1 or 2
            this.#prompt_type = this.#prompt_text_type;
        }

        let prompt;
        // update HTML prompt with randomised values
        if (this.#prompt_text_type == 1) {
            prompt = `Press <span id="prompt_colored">${this.#prompt_color_text}</span>`
            this.#setPromptText(prompt, this.#colorMap.get(this.#prompt_color));
        } else {
            prompt = `Press the <span id="prompt_colored">${this.#prompt_color_text}</span> button`
            this.#setPromptText(prompt, this.#colorMap.get(this.#prompt_color));
        }

    }

    /* update the prompt with the new innerHTML and play animation */
    #setPromptText(innerHTML, color) {
        let prompt = document.getElementById("prompt");
        // update innerHTML
        prompt.innerHTML = innerHTML;

        // Replaying animations can be tricky
        // switching between identical animations is one way of replaying an animation
        if (prompt.style.animationName == "fadeInBottom") {
            prompt.style.animation = "fadeInBottom2 180ms ease-in";
        } else {
            prompt.style.animation = "fadeInBottom 180ms ease-in";
        }

        // set color of text
        document.getElementById("prompt_colored").style.color = color;
    }

    /* update the score counter with the given value */
    #setScoreText(newScore) {
        document.getElementById("score_counter").textContent = newScore;
    }

    /* update the countdown text with the given value */
    #setCountdownText(newValue) {
        document.getElementById("countdown_text").textContent = newValue;
    }

    /* Called within interval to periodically reduce countdown by 1 and also stop game
        if countdown is finished */
    #reduceCountdown() {
        // update html
        this.#setCountdownText(this.#countdown.reduceBySeconds(1));

        if (this.#countdown.isFinished()) {
            // game over due to time running out
            //todo -----------------------------------------------------------
            this.gameOver('Timeout');
        }
    }

    /* Start a 1 second interval that reduces the countdown */
    #startTimer() {
        this.#timer = setInterval(() => this.#reduceCountdown(), 1000);
    }

    /* Clear the active timer */
    #cancelTimer() {
        clearInterval(this.#timer);
    }

    /* Increases the score by 1 and the countdown by 1 second */
    #increaseScore() {
        //update score and html
        this.#score += 1;
        this.#setScoreText(this.#score);

        // while increasing the countdown briefly stop timer and then restart it
        this.#cancelTimer();
        this.#setCountdownText(this.#countdown.increaseBySeconds(1));
        this.#startTimer();
    }

    /* Start the game by updating the html, generate a game prompt and start the countdown */
    startGame() {
        // set score and countdown to initial value
        this.#gameActive = true;
        this.#score = 0;
        this.#setScoreText(this.#score);
        this.#setCountdownText(`00:00:${this.#initialTimeSeconds}`);

        // init countdown object or reset countdown if already initialized
        if (this.#countdown == null) {
            this.#countdown = new Countdown(0, 0, this.#initialTimeSeconds);
        } else {
            this.#countdown.resetCountdown(0, 0, this.#initialTimeSeconds);
        }
        
        //generate game prompt
        this.#updatePrompt();

        // start timer to reduce countdown every second
        this.#startTimer();
    }

    /* Handles the game input by user. If input is correct then, game continues if not game ends */
    gameInput(inputVal) {
        
        if(!this.#gameActive) {
            // do nothing if game is not active
            return;
        }

        // based on current prompt_type check if inputVal is correct
        switch (this.#prompt_type) {
            // type 1 we expect input to be the same as the prompt color
            case 1:
                if (inputVal == this.#prompt_color) {
                    // correct answer -> increase score and generate new prompt
                    this.#increaseScore();
                    this.#updatePrompt();
                } else {
                    this.gameOver(`expected ${this.#prompt_color}`)
                }
                break;
            
            // type 2 we expect input to be the same as the text  
            case 2:
                if (inputVal == this.#prompt_color_text) {
                    // correct answer -> increase score and generate new prompt
                    this.#increaseScore();
                    this.#updatePrompt();
                } else {
                    this.gameOver(`expected ${this.#prompt_color_text}`);
                }
                break;
            
            // type 3 we expect device to be shaken or shake button to be pressed    
            case 3:
                if (inputVal == 'shake') {
                    // correct answer -> increase score and generate new prompt
                    this.#increaseScore();
                    this.#updatePrompt();
                } else {
                    this.gameOver("expected shaking");
                }
                break;
        }
    }

    /* Stop the game and update the prompt to show why game is over */
    gameOver(reason) {
        this.#cancelTimer();
        this.#gameActive = false;

        // change to play button
        let button = document.getElementById("play_button");
        button.innerHTML = '<img src="../icons/controller_icon.svg"><span> Play</span>';

        // update prompt to show that game is over and also the reason why
        this.#setPromptText(`Game over: <span id="prompt_colored">${reason}</span>`, "black");

    }
}