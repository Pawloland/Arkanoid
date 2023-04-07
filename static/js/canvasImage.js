import ifLog from '/static/js/consoleLogWrapper.js'
import Images from '/static/js/images.js'

export default class CanvasImage {
    constructor(sx, sy, sWidth, sHeight, source) {
        if (source == undefined) {
            this.sprite_sheet = Images.getImage('sprite_sheet')
        } else {
            this.sprite_sheet = source
        }
        this.canvas = document.createElement('canvas')
        this.canvas.width = sWidth;
        this.canvas.height = sHeight;
        this.context = this.canvas.getContext("2d")

        this.context.drawImage(this.sprite_sheet, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

        return this.canvas
    }

    static clone(old_canvas) {
        //create a new canvas
        let new_canvas = document.createElement('canvas');
        let context = new_canvas.getContext('2d');

        //set dimensions
        new_canvas.width = old_canvas.width;
        new_canvas.height = old_canvas.height;

        //apply the old canvas to the new one
        context.drawImage(old_canvas, 0, 0);

        //return the new canvas
        return new_canvas;
    }
}