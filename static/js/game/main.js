import ifLog from '/static/js/consoleLogWrapper.js'
import CanvasResizer from '/static/js/game/canvasResizer.js'
import Playfield from '/static/js/game/playfield.js'
import Images from '/static/js/images.js'
import FileLoader from '/static/js/game/fileLoader.js'
import Keyboard from '/static/js/game/keyboard.js'
// import json from '/static/js/game/exportedPlayboard.js'

window.onload = async function () {
    await Images.loadImages()
    let canvas_resizer = new CanvasResizer() // ustawia skalowanie canvasów

    let keyboard = new Keyboard()
    let playfield = new Playfield()

    await new Promise(async (resolve, reject) => {

        if (typeof json == 'undefined') {
            if (document.querySelector('input').files[0] != undefined) {
                ifLog.log('cached map')
                let data = await FileLoader.getData(document.querySelector('input').files[0])
                playfield.createDataArray(data)
                document.getElementById('file_picker').remove()
                resolve(true)
            } else {
                document.getElementById('file_picker').querySelector('input').onchange = async (event) => {
                    ifLog.log('dynamic map')
                    // ifLog.log('odebrano')
                    let data = await FileLoader.getData(event.currentTarget.files[0])
                    playfield.createDataArray(data)
                    event.target.parentElement.remove()
                    resolve(true)
                }
            }
        } else {
            ifLog.log('static map')
            playfield.createDataArray(json)
            document.getElementById('file_picker').remove()
            resolve(true)
        }


    })


}