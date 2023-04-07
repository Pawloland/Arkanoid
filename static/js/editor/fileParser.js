import ifLog from '/static/js/consoleLogWrapper.js'
import Config from '/static/js/editor/config.js'
import CanvasImage from '/static/js/canvasImage.js'

export default class FileParser {
    constructor(selection_actions, history) {
        this.table_cells = []
        this.selection_actions = selection_actions
        this.history = history
    }

    lateInit() {
        this.table_cells = document.getElementById('board').querySelectorAll('td')
        ifLog.log(this.table_cells)
    }

    resetAllPreviousActions() {
        this.selection_actions.selected_cells.forEach(cell => cell.classList.remove('selected'))
        this.selection_actions.selected_cells = []
        this.selection_actions.start_cell = undefined
        this.selection_actions.end_cell = undefined
        this.selection_actions.old_selected_cells = []
        this.selection_actions.hovered_cells.forEach(cell => cell.classList.remove('selected'))
        this.selection_actions.hovered_cells = []
        document.body.querySelectorAll('.selection_overlay').forEach(overlay => overlay.remove());
        Config.dragselect = false
    }

    exportData() {
        ifLog.log('exportData')
        this.resetAllPreviousActions()

        let exported = {}

        for (let td of this.table_cells) {
            const row = parseInt(td.id.split('tr_')[1].split('_td')[0]) //y
            const column = parseInt(td.id.split('td_')[1]); //x

            if (td.className != '') {
                (exported[`row_${row}`] ??= {})[`column_${column}`] = td.className //id td'ka w tabelce z bloczkami do wybory, żeby było wiadomo skąd sklonować klepkę
            }

        }
        ifLog.log(exported)
        return exported
    }


    importData(data) {
        ifLog.log('importData')
        this.resetAllPreviousActions()
        for (let row = 1; row <= 30; row++) {
            for (let column = 1; column <= 14; column++) {
                let td = document.getElementById(`board_tr_${row}_td_${column}`)
                td.innerHTML = ''
                td.removeAttribute('class')

                if (data[`row_${row}`] != undefined && data[`row_${row}`][`column_${column}`] != undefined) {//tak jak w zaimportowanych danych
                    td.className = data[`row_${row}`][`column_${column}`]
                    // ifLog.log(data[`row_${row}`][`column_${column}`])
                    let canvas_block = document.getElementById(data[`row_${row}`][`column_${column}`]).querySelector('canvas')

                    td.append(CanvasImage.clone(canvas_block))

                }

            }
        }
        // this.history.addToHistory(data)
    }

    saveToFile(data) {
        ifLog.log('saveToFile')
        this.resetAllPreviousActions()

        let json = JSON.stringify(data)
        let blob = new Blob([json], { type: "application/json;charset=utf-8" })
        let a = document.createElement("a")
        let url = URL.createObjectURL(blob)
        a.href = url
        a.download = 'exportedPlayboard.json'
        a.click()
    }

    loadFromFile() {
        return new Promise((resolve, reject) => {
            ifLog.log('loadFromFile')
            this.resetAllPreviousActions()

            let input = document.createElement('input')
            input.type = 'file'
            input.onchange = (event) => {
                let file = event.currentTarget.files[0];
                ifLog.log(file)
                let reader = new FileReader()
                reader.readAsText(file, "utf-8");
                reader.onload = () => {
                    let data = JSON.parse(reader.result)
                    ifLog.log(data)
                    resolve(data)
                }
            }
            input.click()
        })

    }
}