import Config from "./config.js"
import ifLog from '../consoleLogWrapper.js'

export default class Keyboard {
    constructor() {

        // events
        window.addEventListener('keydown', event => this.onKeyDown(event), false)
        window.addEventListener('keyup', event => this.onKeyUp(event), false)

    }

    onKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
            case 'a': {
                Config.move_left = false
            } break
            case 'arrowright':
            case 'd': {
                Config.move_right = false
            } break
        }
        // ifLog.log(event)
    }

    onKeyDown(event) {
        document.activeElement.blur();
        // ifLog.log(event.key.toLowerCase())
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
            case 'a': {
                Config.move_left = true
                Config.move_right = false
            } break
            case 'arrowright':
            case 'd': {
                Config.move_left = false
                Config.move_right = true
            } break
        }
        // ifLog.log(event)

    }
}