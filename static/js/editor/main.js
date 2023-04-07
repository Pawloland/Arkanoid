import ifLog from '../consoleLogWrapper.js'
import CreateTable from './createTable.js'
import CanvasImage from '../canvasImage.js'
import Images from '../images.js'
import Config from './config.js'
import Keyboard from './keyboard.js'
import SelectionActions from './selectionActions.js'
import History from './history.js'
import FileParser from './fileParser.js'

window.onload = async function () {
    await Images.loadImages()
    let left_div = document.getElementById('left')
    let right_div = document.getElementById('right')

    let history = new History()
    let selection_actions = new SelectionActions(history)
    let file_parser = new FileParser(selection_actions, history)
    selection_actions.initMenu(history, file_parser)

    //kolorowanie zaznaczen na dany sprite
    window.addEventListener('click', (event) => {
        // ifLog.log(event)
        if (event.button == 0) { // 0= lmb, 2=rmb
            // ifLog.log('click-window')
            if (document.getElementById('shortcuts_menu').style.display == 'flex') {
                selection_actions.hideMenu()
            } else {
                selection_actions.showMenu()
            }
        }
    });

    // generowanie tabelki z klepkami
    let table_blocks = new CreateTable(
        4,
        5,
        'blocks',
        function (td, row, column) {
            if (row < 4) {
                td.append(new CanvasImage(
                    column == 1 ? 5 : 5 + (column - 1) * (8 + 2),
                    row == 1 ? 216 : 216 + (row - 1) * (4 + 1),
                    8,
                    4
                ))

                // td.className = `color_row_${row}_column_${column}`

                td.addEventListener('click', (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    if (selection_actions.selected_cells.length > 0) {
                        for (let td of selection_actions.selected_cells) {
                            td.innerHTML = ''
                            td.append(CanvasImage.clone(event.currentTarget.querySelector('canvas')))
                            td.className = `blocks_tr_${row}_td_${column}`
                            selection_actions.cssDeselect(td)
                        }
                        selection_actions.selected_cells = []
                        history.addToHistory(file_parser.exportData())
                    }
                })
            }
        },
    )
    left_div.append(table_blocks)


    // generowanie planszy do ustawiania klepek
    let table_board = new CreateTable(
        20,
        14,
        'board',
        function (td, row, column) {

            td.addEventListener('contextmenu', (event) => {
                // event.stopPropagation();
                event.preventDefault();
            });

            td.addEventListener('mousedown', (event) => {
                // ifLog.log(event)
                // ifLog.log('mousedown')
                // ifLog.log(event.button)
                if (event.button == 2) {//2 == rmb, 0 == lmb (w zależności od ustawień lokalnych komputera, czyli może być na odwrót dla leworęcznych)
                    // event.preventDefault()
                    // event.stopPropagation()
                    selection_actions.startDragSelect(event)
                }
            })

            td.addEventListener('mouseenter', (event) => {
                // ifLog.log(event)
                // ifLog.log('mouseenter')
                // ifLog.log(event.button)
                if (Config.dragselect == true) {
                    // event.preventDefault()
                    // event.stopPropagation()
                    selection_actions.updateHoveredCells(event)
                }
            })

            td.addEventListener('mousemove', (event) => {
                // ifLog.log(event)
                // ifLog.log('mousemove')
                // ifLog.log(event.button)
                if (Config.dragselect == true) {
                    // event.preventDefault()
                    // event.stopPropagation()
                    selection_actions.updateOverlay(event)
                }

            })

            td.addEventListener('mouseup', (event) => {
                // ifLog.log(event)
                // ifLog.log('mouseup')
                // ifLog.log(event.button)
                if (event.button == 2) {
                    // event.preventDefault()
                    // event.stopPropagation()
                    if (selection_actions.start_cell.id == event.currentTarget.id) {
                        Config.dragselect = false
                        selection_actions.singleClick(event)
                    } else {

                        // if (Config.dragselect == true) {
                        selection_actions.stopDragSelect()
                        // }

                    }
                }

            })

        },
    )
    right_div.append(table_board)

    let keyboard = new Keyboard(selection_actions, file_parser, history)
    file_parser.lateInit()
}