import { ColorGame } from "./util/colorGame.js";

// create game object
const game = new ColorGame();

// tracks if motionevent should be ignored
let ignoreMotionEvent = false;


// make adjustments to html /////////////

// assign onclick functions to game related buttons
const shakeButton = document.getElementById("shake_button");
shakeButton.onclick = function () {game.gameInput('shake')};
document.getElementById("red_game_button").onclick = function () {game.gameInput('red');}
document.getElementById("blue_game_button").onclick = function () {game.gameInput('blue');}
document.getElementById("green_game_button").onclick = function () {game.gameInput('green');}
document.getElementById("play_button").onclick = function () {onPlayButtonPressed();}




// DeviceMotionEvent can only be used with HTTPS
if (location.protocol == 'https:') {
    // check if browser supports DeviceMotion
    if (window.DeviceMotionEvent) {
        if (confirm("Are you ok with using the acceleration of your device as a game input? Please note that if your device has no acceleration sensor then this will not work.")) {
            // user is ok with using the devicemotion as input
            // remove shake button
            window.addEventListener('devicemotion', (event) => handleDeviceMotion(event));
        } else {
            // user does not want to use device acceleration -> display shake button
            shakeButton.style.display = 'inline';
        }

    } else {
        window.alert("Browser doesn't support DeviceMotion. We'll add a shake button so that you can play the game without issues.");
        shakeButton.style.display = 'inline';
    }
} else {
    // no HTTPS so we need shake button to play the game
    window.alert("Access to sensor denied due to insecure connection. Please use HTTPS if you want to play while using the device acceleration as input!");
    shakeButton.style.display = 'inline';
}

// if shake button is not displayed and screen is wide enough then make blue button take up more space
if (window.screen.availWidth >= 700 && shakeButton.style.display == "") {
    document.getElementById("blue_game_button").style.gridColumn = "1 / 3";
}

// end of adjustments to html /////////////

/* This methods is called when a deviceMotionEvent happens. It checks whether the motion values
    exceed the threshold and then calls the gameInput function with a shake input. */
function handleDeviceMotion(motionEvent) {
    let threshold = 18;
    var x = motionEvent.accelerationIncludingGravity.x;
    var y = motionEvent.accelerationIncludingGravity.y;
    var z = motionEvent.accelerationIncludingGravity.z;
    
    // if device motion exceeds threshold then we treat it as a shake game input
    if (!ignoreMotionEvent && (x > threshold || y > threshold || z > threshold)) {
        ignoreMotionEvent = true;
        game.gameInput('shake');

        // to prevent that shaking the device can trigger a game input multiple times
        // which would likely result in a game over, we ignore the events for a small time period
        setTimeout(() => ignoreMotionEvent=false, 250)
    }
}

/* Change icon, text and onclick depending on the current state.
    If active then the button will change to a quit button and if not then the button
    enables the user to start a game. */
function onPlayButtonPressed() {

    let button = document.getElementById("play_button");

    // second child is span element which contains the text
    if (button.children[1].textContent == ' Play') {
        game.startGame();
        // change to quit button
        button.innerHTML = '<img src="../icons/cross.svg"><span> Quit</span>';
    } else {
        game.gameOver('Quit by player')
        // change to play button
        button.innerHTML = '<img src="../icons/controller_icon.svg"><span> Play</span>';
    }
}


