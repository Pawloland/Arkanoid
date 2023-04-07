import ifLog from '../consoleLogWrapper.js'

export default class CanvaResizer {
    constructor() {
        this.#init()
    }

    // # przed nazwą powinnien działać jako oznaczenie private methody albo jakiejś private var
    // które mówi, że zmienna albo metoda moze być wywołana tylko wewnątrz klasy
    // ale nie musi to zawsze działać w kazdej przeglądarce, więc jest to bardziej takie 
    // ułatwienie w czytelności kodu

    #canvasResize(canvas) {
        // ifLog.log('resize')
        if (canvas.parentElement.getBoundingClientRect().width < canvas.parentElement.getBoundingClientRect().height) { // szeokość : WYSOKOŚĆ  parent_taga css_px
            // ifLog.log(canvas.parentElement.tagName.toLocaleLowerCase() + ': width < height')
            if (canvas.width < canvas.height) {  // szeokość : WYSOKOŚĆ  canvas canvas_px
                // ifLog.log('canvas: width < height')
                let tmp_width_percent = ((canvas.width * 100 / canvas.height) / 100 * canvas.parentElement.getBoundingClientRect().height) / canvas.parentElement.getBoundingClientRect().width * 100
                let tmp_height_percent = 100
                if (tmp_width_percent > 100) {
                    // ifLog.log('shrinked')
                    tmp_width_percent = 100
                    tmp_height_percent = ((canvas.height * 100 / canvas.width) / 100 * canvas.parentElement.getBoundingClientRect().width) / canvas.parentElement.getBoundingClientRect().height * 100
                }
                canvas.style.width = tmp_width_percent + '%'
                canvas.style.height = tmp_height_percent + '%'

            } else if (canvas.width == canvas.height) { // SZEROKOŚĆ : WYSOKOŚĆ  canvas canvas_px
                // ifLog.log('canvas: width = height')
                let tmp_width_percent = 100
                let tmp_height_percent = canvas.parentElement.getBoundingClientRect().width / canvas.parentElement.getBoundingClientRect().height * 100
                canvas.style.width = tmp_width_percent + '%'
                canvas.style.height = tmp_height_percent + '%'

            } else if (canvas.width > canvas.height) { // SZEROKOŚĆ : wysokość  canvas canvas_px
                // ifLog.log('canvas: width > height')
                let tmp_width_percent = 100
                let tmp_height_percent = ((canvas.height * 100 / canvas.width) / 100 * canvas.parentElement.getBoundingClientRect().width) / canvas.parentElement.getBoundingClientRect().height * 100
                canvas.style.width = tmp_width_percent + '%'
                canvas.style.height = tmp_height_percent + '%'
            }

        } else if (canvas.parentElement.getBoundingClientRect().width == canvas.parentElement.getBoundingClientRect().height) { // SZEROKOŚĆ : WYSOKOŚĆ parent_taga css_px
            // ifLog.log(canvas.parentElement.tagName.toLocaleLowerCase() + ': width == height')
            if (canvas.width < canvas.height) {  // szeokość : WYSOKOŚĆ  canvas canvas_px
                // ifLog.log('canvas: width < height')
                canvas.style.width = (canvas.width * 100 / canvas.height) + '%'
                canvas.style.height = '100%'
            } else if (canvas.width == canvas.height) { // SZEROKOŚĆ : WYSOKOŚĆ  canvas canvas_px
                // ifLog.log('canvas: width = height')
                canvas.style.width = '100%'
                canvas.style.height = '100%'
            } else if (canvas.width > canvas.height) { // SZEROKOŚĆ : wysokość  canvas canvas_px
                // ifLog.log('canvas: width > height')
                canvas.style.width = '100%'
                canvas.style.height = (canvas.height * 100 / canvas.width) + '%'
            }

        } else if (canvas.parentElement.getBoundingClientRect().width > canvas.parentElement.getBoundingClientRect().height) {// SZEROKOŚĆ : wysokość parent_taga css_px
            // ifLog.log(canvas.parentElement.tagName.toLocaleLowerCase() + ': width > height')
            if (canvas.width < canvas.height) {  // szeokość : WYSOKOŚĆ  canvas canvas_px
                // ifLog.log('canvas: width < height')
                let tmp_width_percent = ((canvas.width * 100 / canvas.height) / 100 * canvas.parentElement.getBoundingClientRect().height) / canvas.parentElement.getBoundingClientRect().width * 100
                let tmp_height_percent = 100
                canvas.style.width = tmp_width_percent + '%'
                canvas.style.height = tmp_height_percent + '%'

            } else if (canvas.width == canvas.height) { // SZEROKOŚĆ : WYSOKOŚĆ  canvas canvas_px
                // ifLog.log('canvas: width = height')
                let tmp_width_percent = canvas.parentElement.getBoundingClientRect().height / canvas.parentElement.getBoundingClientRect().width * 100
                let tmp_height_percent = 100

                canvas.style.width = tmp_width_percent + '%'
                canvas.style.height = tmp_height_percent + '%'

            } else if (canvas.width > canvas.height) { // SZEROKOŚĆ : wysokość  canvas canvas_px
                // ifLog.log('canvas: width > height')
                let tmp_width_percent = 100
                let tmp_height_percent = ((canvas.height * 100 / canvas.width) / 100 * canvas.parentElement.getBoundingClientRect().width) / canvas.parentElement.getBoundingClientRect().height * 100

                if (tmp_height_percent > 100) {
                    // ifLog.log('shrinked')

                    tmp_height_percent = 100
                    tmp_width_percent = ((canvas.width * 100 / canvas.height) / 100 * canvas.parentElement.getBoundingClientRect().height) / canvas.parentElement.getBoundingClientRect().width * 100
                }
                canvas.style.width = tmp_width_percent + '%'
                canvas.style.height = tmp_height_percent + '%'
            }
        }

    }


    #init() {
        for (let canvas of document.querySelectorAll('canvas.contain')) {
            this.#canvasResize(canvas)
            new ResizeObserver(() => { this.#canvasResize(canvas) }).observe(canvas)
        }
    }
}

