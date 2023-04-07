import ifLog from '../consoleLogWrapper.js'
// import Config from './config.js'

export default class History {
    constructor() {
        this.history = [{}]
        this.current_history_index = 0
    }

    addToHistory(data) {
        ifLog.log('addToHistory')
        ifLog.log([... this.history])
        ifLog.log('this.history.length ' + this.history.length)
        if (this.history.length > 1) {
            this.history.splice(this.current_history_index + 1, this.history.length - this.current_history_index, data)
            ifLog.log('wlaz')
        } else {
            this.history.push(data)
        }
        this.current_history_index = this.history.length - 1
        ifLog.log(this.current_history_index)
        ifLog.log([... this.history])
        ifLog.log(this.current_history_index)
    }

    moveBackInHistory() { //undo
        if (this.current_history_index - 1 >= 0) {
            this.current_history_index--
        }
        ifLog.log(this.current_history_index)
    }

    moveForwardInHistory() { //redo
        if (this.current_history_index + 1 <= this.history.length - 1) {
            this.current_history_index++
        }
        ifLog.log(this.current_history_index)
    }
}