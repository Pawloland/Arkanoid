import Config from "/static/js/editor/config.js"
import ifLog from '/static/js/consoleLogWrapper.js'

export default class Keyboard {
    constructor(selection_actions, file_parser, history) {

        // events
        window.addEventListener('keydown', event => this.onKeyDown(event), false);
        window.addEventListener('keyup', event => this.onKeyUp(event), false);

        window.addEventListener('keydown', (event) => {
            if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() == 'z') {
                //undo
                event.preventDefault();
                ifLog.log('undo')
                history.moveBackInHistory()
                file_parser.importData(history.history[history.current_history_index])
            } else if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() == 'y') {
                //redo
                event.preventDefault();
                ifLog.log('redo')
                history.moveForwardInHistory()
                file_parser.importData(history.history[history.current_history_index])
            } else if (selection_actions.selected_cells.length > 0 && event.key.toLowerCase() == 'delete') {
                //delete
                event.preventDefault();
                ifLog.log('delete')
                for (let td of selection_actions.selected_cells) {
                    td.innerHTML = ''
                    td.removeAttribute('class')
                    selection_actions.cssDeselect(td)
                }
                selection_actions.selected_cells = []
                history.addToHistory(file_parser.exportData())
            } else if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() == 's') {
                //save
                event.preventDefault();
                ifLog.log('save')
                file_parser.saveToFile(file_parser.exportData())

            } else if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() == 'l') {
                //load
                this.loadKeyboarEvent(event, file_parser, history)
            }
        });

    }

    async loadKeyboarEvent(event, file_parser, history) {
        event.preventDefault();
        ifLog.log('load')
        file_parser.importData(await file_parser.loadFromFile())
        history.addToHistory(file_parser.exportData())
    }

    onKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'control':
            case 'meta': {
                Config.multiselect = false
                // ifLog.log(Config.multiselect)
            } break
            // default: {
            //     if (event.metaKey) {
            //         Config.multiselect = false
            //         // ifLog.log(Config.multiselect)
            //     }
            // } break
        }
        // ifLog.log(event)
    }

    onKeyDown(event) {
        // ifLog.log(event.key.toLowerCase())
        switch (event.key.toLowerCase()) {
            case 'control':
            case 'meta': {
                if (Config.multiselect == false) {
                    Config.multiselect = true
                    // ifLog.log(Config.multiselect)
                }
            } break
            // default: {
            //     if (event.metaKey) {
            //         if (Config.multiselect == false) {
            //             Config.multiselect = true
            //             // ifLog.log(Config.multiselect)
            //         }
            //     }
            // } break
        }
        // ifLog.log(event)

    }
}