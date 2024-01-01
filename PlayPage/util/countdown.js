
/* Simple countdown class which provides methods to decrease and increase the countdown. 
    This class is best used in combination with setInterval() */
export class Countdown {

    constructor (hours, minutes, seconds) {
        // convert everything to seconds
        this.duration = (hours * 60 * 60) + (minutes * 60) + seconds;
    }

    /* Adds a leading zero if the timeVal is less than 10 and returns a formatted string */
    #formatOutput(timeVal) {
        return ("0" + timeVal).length > 2 ? timeVal : "0" + timeVal;
    }

    /* Check if the countdown is negative which means that the countdown has finished.
        Returns: True if the countdown is finished and false otherwise. */
    isFinished() {
        return this.duration >= 0 ? false : true;
    }

    /* This method takes an amount of seconds and increases the countdown by the given amount.
        Returns: a String that represents the remaining duration in Hours:Minutes:Seconds */
    increaseBySeconds(seconds) {
        if (this.isFinished()) {
            throw 'Countdown is zero and should be reset first.';
        } else if (seconds < 0) {
            throw 'Param should be greater or equal than 0!'
        }
        // update duration and recalculate hours, minutes
        this.duration += seconds;

        let hours = (Math.floor(this.duration / (60 * 60)) % 24);
        let minutes = Math.floor(this.duration / 60) % 60;
        let sec = this.duration % 60;

        return `${this.#formatOutput(hours)}:${this.#formatOutput(minutes)}:${this.#formatOutput(sec)}`;
    }

    /* This methods takes an amount of seconds and then reduces the countdown by the given amount.
        Returns: a String that represents the remaining duration in Hours:Minutes:Seconds */
    reduceBySeconds(seconds) {
        if (this.isFinished()) {
            throw 'Countdown is already finished!';
        } else if (seconds < 0) {
            throw 'Param should be greater or equal than 0';
        } else if (seconds > this.duration) {
            // if countdown is reduced below 0 then countdown is done so we can cancel it
            return this.cancelCountdown();
        } else {
            // update duration and recalculate hours, minutes
            this.duration -= seconds;
            
            let hours = (Math.floor(this.duration / (60 * 60)) % 24);
            let minutes = Math.floor(this.duration / 60) % 60;
            let sec = this.duration % 60;

            return `${this.#formatOutput(hours)}:${this.#formatOutput(minutes)}:${this.#formatOutput(sec)}`;
        }
    }

    /* Resets the countdown to the given time period */
    resetCountdown(hours, minutes, seconds) {
        // convert everything to seconds and reset duration to the given time period
        this.duration = (hours * 60 * 60) + (minutes * 60) + seconds;
    }

    /* Cancel the countdown and return a countdown string with 0 time remaining */
    cancelCountdown() {
        this.duration = -1;
        return '00:00:00';
    }

}