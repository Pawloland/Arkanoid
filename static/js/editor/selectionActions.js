import ifLog from '../consoleLogWrapper.js'
import Config from './config.js'


export default class SelectionActions {
    constructor() {
        this.selected_cells = [] // wszytskie zaznaczone
        this.start_cell = undefined
        this.end_cell = undefined
        this.old_selected_cells = [] // potrzebne do edge case'a
        this.hovered_cells = [] // zaznaczone tylko w jednej sekwencji drag
        this.div = document.createElement('div')
        this.div.className = 'selection_overlay'
        this.div_start_click = { top: undefined, left: undefined }
        this.div_menu = document.getElementById('shortcuts_menu')


    }

    cssSelect(dom_element) {
        dom_element.classList.add('selected')
    }

    cssDeselect(dom_element) {
        dom_element.classList.remove('selected')
    }

    hideMenu() {
        try {
            this.div_menu.removeAttribute('style')
        } catch (error) { }
    }

    showMenu() {
        this.div_menu.style.display = 'flex'
    }

    initMenu(history, file_parser) {
        document.getElementById('undo').addEventListener('click', (event) => {
            ifLog.log('undo')
            history.moveBackInHistory()
            file_parser.importData(history.history[history.current_history_index])
        })
        document.getElementById('redo').addEventListener('click', (event) => {
            ifLog.log('redo')
            history.moveForwardInHistory()
            file_parser.importData(history.history[history.current_history_index])
        })
        document.getElementById('delete').addEventListener('click', (event) => {
            ifLog.log('delete')
            event.preventDefault();
            for (let td of this.selected_cells) {
                td.innerHTML = ''
                td.removeAttribute('class')
                this.cssDeselect(td)
            }
            this.selected_cells = []
            history.addToHistory(file_parser.exportData())
        })
        document.getElementById('save').addEventListener('click', (event) => {
            ifLog.log('save')
            event.preventDefault()
            file_parser.saveToFile(file_parser.exportData())
        })
        document.getElementById('load').addEventListener('click', async (event) => {
            ifLog.log('load')
            event.preventDefault();
            file_parser.importData(await file_parser.loadFromFile())
            history.addToHistory(file_parser.exportData())

        })
    }

    startDragSelect(event) {
        this.hideMenu()
        this.start_cell = event.currentTarget
        this.end_cell = event.currentTarget
        this.hovered_cells = [event.currentTarget] // zaznaczone tylko w jednej sekwencji drag
        // this.old_selected_cells_count = this.selected_cells.length
        this.old_selected_cells = [...  this.selected_cells]
        if (Config.multiselect == false) {
            for (let cell of this.selected_cells) {
                this.cssDeselect(cell)
            }
            this.selected_cells = []
        }
        Config.dragselect = true
        this.cssSelect(event.currentTarget)

        this.div_start_click = { top: event.pageY, left: event.pageX }
        ifLog.log(this.div_start_click)
        this.div.style.top = this.div_start_click.top + 'px'
        this.div.style.left = this.div_start_click.left + 'px'
        this.div.style.width = 0 + 'px'
        this.div.style.height = 0 + 'px'

        document.body.append(this.div.cloneNode())
    }

    updateOverlay(event) {
        //                 left    event.pageX
        //               0───────────────────────────►
        //             0
        //             │  ┌────────────┬────────────┐
        //         top │  │            │            │
        //             │  │            │            │
        //             │  │     4     4,5     1     │
        //             │  │            │            │
        // event.pageY │  │            │            │
        //             │  │           ┌┴┐           │
        //             │  ├────3,5────┤5├────1,5────┤
        //             │  │           └┬┘           │
        //             │  │            │            │
        //             │  │            │            │
        //             │  │     3     2,5     2     │
        //             │  │            │            │
        //             │  │            │            │
        //             ▼  └────────────┴────────────┘
        //
        //    5 to jest miejsce w którym po raz pierwszy została wciśnięta myszka
        this.hideMenu()

        let x = [this.div_start_click.left, event.pageX].sort((a, b) => a - b) //sort nr asc
        let y = [this.div_start_click.top, event.pageY].sort((a, b) => a - b) //sort nr asc
        let width = (x[1] - x[0]) + 'px'
        let height = (y[1] - y[0]) + 'px'
        ifLog.log(width, height)

        document.body.querySelector('.selection_overlay').style.top = y[0] + 'px'
        document.body.querySelector('.selection_overlay').style.left = x[0] + 'px'
        document.body.querySelector('.selection_overlay').style.width = width
        document.body.querySelector('.selection_overlay').style.height = height

    }

    updateHoveredCells(event) {
        this.hideMenu()
        this.end_cell = event.currentTarget


        // przelicznie wierzchołków prostokąta

        const start_row = parseInt(this.start_cell.id.split('tr_')[1].split('_td')[0]) //y
        const start_column = parseInt(this.start_cell.id.split('td_')[1]) //x
        ifLog.log(start_row, start_column)

        const end_row = parseInt(this.end_cell.id.split('tr_')[1].split('_td')[0]) //y
        const end_column = parseInt(this.end_cell.id.split('td_')[1]) //x
        ifLog.log(end_row, end_column)

        let rows = [start_row, end_row].sort((a, b) => a - b) //sort nr asc
        let columns = [start_column, end_column].sort((a, b) => a - b) //sort nr asc
        ifLog.log(rows, columns)

        //usuwanie klasy selected css z elementów td jeśli nie jest w stałym selected

        for (let hovered_cell of this.hovered_cells) {
            if (this.selected_cells.every(selected_cell => selected_cell.id != hovered_cell.id)) {
                this.cssDeselect(hovered_cell)
            }
        }

        // reset tablicy, bo zaraz od 0 ją przeliczymy
        this.hovered_cells = []

        // uzupełnienie tablicy o aktualne zaznaczone miejsca i od razu ustawienie im css na selected
        for (let row = rows[0]; row <= rows[1]; row++) {
            for (let column = columns[0]; column <= columns[1]; column++) {
                ifLog.log(`board_tr_${row}_td_${column}`)
                let found_td = document.getElementById(`board_tr_${row}_td_${column}`)
                this.cssSelect(found_td)
                this.hovered_cells.push(found_td)
            }
        }


    }

    stopDragSelect() {
        this.hideMenu()

        Config.dragselect = false
        this.start_cell = undefined
        this.end_cell = undefined


        for (let hovered_cell of this.hovered_cells) {

            // jeśli zaznaczony hoverem element nie był wcześniej już zaznaczony na stałe
            if (this.selected_cells.every(cell => cell.id != hovered_cell.id) == true) {
                // to tyko wtedy dodaj go do listy stale zaznaczonych td-ków
                this.selected_cells.push(hovered_cell)
            }
        }
        // resetowanie tablicy zaznaczonych hoverem (dane byłu zrzucone selected_cells na stałe)
        this.hovered_cells = []

        ifLog.log(document.body.getElementsByClassName('selection_overlay'))
        document.body.querySelectorAll('.selection_overlay').forEach(overlay => overlay.remove());
        // document.body.getElementsByClassName('selection_overlay').forEach(element => { element.remove() })
        ifLog.log(this.selected_cells)
    }

    singleClick(event) {
        this.hideMenu()
        document.body.querySelectorAll('.selection_overlay').forEach(overlay => overlay.remove());
        //flaga która sprawdza, czy na planszy było tylko jedno zaznaczone miejsce i czy ono zostało wciśnięte
        let single_change_flag = false

        // jeśli ctrl nie był wciśnięty (bez multiselecta)
        if (Config.multiselect == false) {
            // jeśli został odznaczony tylko jeden pionek, poprzednio zaznaczony, to ustawiamy flagę
            if (this.old_selected_cells.length == 1 && this.old_selected_cells[0].id == event.currentTarget.id) {
                single_change_flag = true
            }

            // usuwamy wszytskie wcześniej zaznaczone pola
            for (let cell of this.selected_cells) {
                this.cssDeselect(cell)
            }
            this.selected_cells = []
        }

        // jeśli aktualnie nasciśnięte miejsce nie było poprzednio zaznzaczone oraz flaga mówiąca o tym czy na planszy było tylko jedno zaznaczone miejsce i czy ono zostało naciśnięte
        if (this.selected_cells.every(cell => cell.id != event.currentTarget.id) == true && single_change_flag == false) {
            //to dodajemy do zaznaczonych (jeśli bez ctrl to tablica zostala uprzdnio wyczyszczona, jeśli z ctrl to dopisuje do poprzednio zaznaczonych) i ustawiamy css na selected
            this.selected_cells.push(event.currentTarget)
            this.cssSelect(event.currentTarget)
        } else {
            // jeśli dane pole było wcześniej zaznaczone (pojedyncze na planszy albo i nie) to usuwamy zaznaczenie
            this.selected_cells = this.selected_cells.filter(cell => cell.id != event.currentTarget.id) // zostawaia tylko te td-ki, które nie są aktualnie klikniętym
            this.cssDeselect(event.currentTarget)
        }
        ifLog.log(this.selected_cells)
    }
}