import ifLog from '../consoleLogWrapper.js'

export default class CreateTable {
    constructor(rows, columns, id, constructor_td_callback = () => { }) {
        let table = document.createElement('table')
        table.id = id
        for (let row = 1; row <= rows; row++) {
            let tr = document.createElement('tr')
            tr.id = `${id}_tr_${row}`
            for (let column = 1; column <= columns; column++) {
                let td = document.createElement('td')
                td.id = `${id}_tr_${row}_td_${column}`

                // td.addEventListener('click', (event) => { td_click_callback(event) })
                // td.addEventListener('mouseenter', (event) => { td_mouseenter_callback(event) })
                // td.addEventListener('mouseleave', (event) => { td_mouseleave_callback(event) })

                constructor_td_callback(td, row, column)

                tr.append(td)

            }
            table.append(tr)
        }
        return table
    }
}