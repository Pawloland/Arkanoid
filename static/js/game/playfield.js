import ifLog from '/static/js/consoleLogWrapper.js'
import Images from '/static/js/images.js'
import CanvasImage from '/static/js/canvasImage.js'
import Config from '/static/js/game/config.js'

export default class Playfield {
    constructor() {
        this.canvas = document.getElementById('playboard')
        this.context = this.canvas.getContext('2d')
        this.rows = 20
        this.columns = 14
        // this.angle_full = 90
        // this.angle_half = 45
        // this.angle_quarter = 22.5
        // this.angle_three_quarters = 67.5
        this.full_bg_tiles_canvas = new CanvasImage(0, 384, 128, 128)
        this.mini_sprite_sheet = new CanvasImage(128, 0, 128, 128)
        this.game_ended = false

        // left barrier
        this.whole_left_barrier_canvas = new CanvasImage(0, 13, 7, 115, this.mini_sprite_sheet)
        this.left_to_bottom_part_barrier_canvases = [
            new CanvasImage(7, 24, 1, 24, this.mini_sprite_sheet),
            new CanvasImage(7, 61, 1, 24, this.mini_sprite_sheet),
            new CanvasImage(7, 98, 1, 24, this.mini_sprite_sheet)
        ]

        // top barrier
        this.whole_top_barrier_canvas = new CanvasImage(0, 13, 128, 7, this.mini_sprite_sheet)
        this.top_to_right_part_barrier_canvases = [
            new CanvasImage(22, 20, 27, 1, this.mini_sprite_sheet),
            new CanvasImage(79, 20, 27, 1, this.mini_sprite_sheet),
        ]

        // right barrier
        this.whole_right_barrier_canvas = new CanvasImage(121, 13, 7, 115, this.mini_sprite_sheet)
        this.right_to_bottom_part_barrier_canvases = [
            new CanvasImage(120, 24, 1, 24, this.mini_sprite_sheet),
            new CanvasImage(120, 61, 1, 24, this.mini_sprite_sheet),
            new CanvasImage(120, 98, 1, 24, this.mini_sprite_sheet),
        ]

        // blocks sprite mini
        this.mini_blocks_sprite_sheet = new CanvasImage(5, 216, 48, 14)
        this.bricks = {
            blocks_tr_1_td_1: new CanvasImage(0, 0, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_1_td_2: new CanvasImage(10, 0, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_1_td_3: new CanvasImage(20, 0, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_1_td_4: new CanvasImage(30, 0, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_1_td_5: new CanvasImage(40, 0, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_2_td_1: new CanvasImage(0, 5, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_2_td_2: new CanvasImage(10, 5, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_2_td_3: new CanvasImage(20, 5, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_2_td_4: new CanvasImage(30, 5, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_2_td_5: new CanvasImage(40, 5, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_3_td_1: new CanvasImage(0, 10, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_3_td_2: new CanvasImage(10, 10, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_3_td_3: new CanvasImage(20, 10, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_3_td_4: new CanvasImage(30, 10, 7, 3, this.mini_blocks_sprite_sheet),
            blocks_tr_3_td_5: new CanvasImage(40, 10, 7, 3, this.mini_blocks_sprite_sheet),
        }

        // paddle_sprite
        this.paddle_sprite_sheet = new CanvasImage(42, 106, 27, 6, this.mini_sprite_sheet)
        let pixels_to_change_paddle = [
            // row 0
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 6, y: 0 },
            { x: 20, y: 0 },
            { x: 24, y: 0 },
            { x: 25, y: 0 },
            { x: 26, y: 0 },
            // row 1
            { x: 0, y: 1 },
            { x: 26, y: 1 },
            // row 4 
            { x: 0, y: 4 },
            { x: 26, y: 4 },
            // row 5
            { x: 0, y: 5 },
            { x: 1, y: 5 },
            { x: 2, y: 5 },
            { x: 6, y: 5 },
            { x: 20, y: 5 },
            { x: 24, y: 5 },
            { x: 25, y: 5 },
            { x: 26, y: 5 },
        ]
        // this.changePixel(this.paddle_sprite_sheet, pixels_to_change_paddle, { red: 0, green: 0, blue: 0, alpha: 0 })
        this.changePixel(this.paddle_sprite_sheet, pixels_to_change_paddle, { red: 255, green: 0, blue: 0, alpha: 255 })


        // ball_sprite
        this.ball_sprite_sheet = new CanvasImage(45, 90, 4, 4, this.mini_sprite_sheet)
        let pixels_to_change_ball = [
            // row 0
            { x: 0, y: 0 },
            { x: 3, y: 0 },
            // row 3 
            { x: 0, y: 3 },
            { x: 3, y: 3 },
        ]
        this.changePixel(this.ball_sprite_sheet, pixels_to_change_ball, { red: 0, green: 0, blue: 0, alpha: 0 }) // transarent
        // this.changePixel(this.ball_sprite_sheet, pixels_to_change_ball, { red: 255, green: 255, blue: 255, alpha: 255 }) // white


        this.data = {
            bricks: {},
            ball: {
                x: 62,
                y: 102,
                // angle: this.angle_half,
                speed: 1,
                vectors: {
                    vector_1: {
                        angle_wide: 45,
                        x: 1,
                        y: 1
                    },
                    vector_2: {
                        angle_shallow: 26.565,
                        x: 2,
                        y: 1,
                    }

                },
                directions: {
                    //        -1
                    //         │
                    //         │
                    // -1 ─────┼─────► 1
                    //         │     x
                    //         │
                    //         ▼ y
                    //         1
                    x: 1,
                    y: -1,
                },
            },
            paddle: {
                x: 50,
                y: 106,
                width: 27,
                height: 6,
                speed: 3,
            }

        }

        this.skipped_frames = 0
    }

    createDataArray(json) {
        for (let row = 1; row <= this.rows; row++) {
            this.data.bricks[`row_${row}`] ??= {}
            for (let column = 1; column <= this.columns; column++) {
                this.data.bricks[`row_${row}`][`column_${column}`] = {
                    color: (json[`row_${row}`] ??= {})[`column_${column}`],
                }
            }
        }
        ifLog.log(this.data)
        this.redraw()
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = "black"
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawBackgroundTiles() {
        this.context.drawImage(this.full_bg_tiles_canvas, 3, 3, 114, 108, 7, 20, 114, 108)
    }

    drawLeftAndTopBarrier() {
        // shadow left
        this.context.globalAlpha = 0.8;
        this.context.fillStyle = "black";
        this.context.fillRect(7, 20, 5, 108);
        this.context.globalAlpha = 1;

        this.context.drawImage(this.whole_left_barrier_canvas, 0, 0, 7, 115, 0, 13, 7, 115)
        this.context.drawImage(this.left_to_bottom_part_barrier_canvases[0], 0, 0, 1, 24, 7, 24, 1, 24)
        this.context.drawImage(this.left_to_bottom_part_barrier_canvases[1], 0, 0, 1, 24, 7, 61, 1, 24)
        this.context.drawImage(this.left_to_bottom_part_barrier_canvases[2], 0, 0, 1, 24, 7, 98, 1, 24)

        // shadow top
        this.context.globalAlpha = 0.8;
        this.context.fillStyle = "black";
        this.context.fillRect(12, 20, 109, 4);
        this.context.globalAlpha = 1;

        this.context.drawImage(this.whole_top_barrier_canvas, 0, 0, 128, 7, 0, 13, 128, 7)
        this.context.drawImage(this.top_to_right_part_barrier_canvases[0], 0, 0, 27, 1, 22, 20, 27, 1)
        this.context.drawImage(this.top_to_right_part_barrier_canvases[1], 0, 0, 27, 1, 79, 20, 27, 1)
    }

    drawBrick(brick_color, brick_row, brick_column) {
        const translated_position = this.getBrickTranslatedPositon(brick_row, brick_column)

        // brick rows & columns start indexing from nr 1
        //x8 y21 -> top left corner where we start placing bricks
        //x7 y3  -> brick width & height without shadow (used for collision)
        //x8 y4  -> brick width & height with shadow (1px shadow is added to right and bottom side)

        // .......|     . -> 1px brick color area
        // .......|     | -> 1px shadow right area
        // .......|     _ -> 1px shadow bottom area
        // _______|        

        this.context.drawImage(this.bricks[brick_color], 0, 0, 7, 3, translated_position.dx, translated_position.dy, 7, 3)

        // ifLog.log(this.bricks[brick_color])
        // alert()

        // shadow bottom
        this.context.globalAlpha = 0.8
        this.context.fillStyle = "black"
        this.context.fillRect(translated_position.dx, translated_position.dy + 3, 7, 1)

        // shadow right
        this.context.fillStyle = "black"
        this.context.fillRect(translated_position.dx + 7, translated_position.dy, 1, 4)
        this.context.globalAlpha = 1



    }

    drawRightBarrier() {
        this.context.drawImage(this.whole_right_barrier_canvas, 0, 0, 7, 115, 121, 13, 7, 115)
        this.context.drawImage(this.right_to_bottom_part_barrier_canvases[0], 0, 0, 1, 24, 120, 24, 1, 24)
        this.context.drawImage(this.right_to_bottom_part_barrier_canvases[1], 0, 0, 1, 24, 120, 61, 1, 24)
        this.context.drawImage(this.right_to_bottom_part_barrier_canvases[1], 0, 0, 1, 24, 120, 98, 1, 24)

    }

    drawPaddle() {
        // const offset_top = 106
        this.context.drawImage(this.paddle_sprite_sheet, 0, 0, 27, 6, this.data.paddle.x, 106, 27, 6)
    }

    canMovePaddle(direction) {
        let gap
        if (direction == "left") {
            gap = this.data.paddle.x - 8
        } else if (direction == "right") {
            gap = 119 - (this.data.paddle.x + this.data.paddle.width - 1)
        }
        if (gap > 0) {
            return {
                bool: true,
                distance: gap >= this.data.paddle.speed ? this.data.paddle.speed : gap
            }
        } else {
            return {
                bool: false
            }
        }
    }

    movePaddleLeft(distance) {
        this.data.paddle.x -= distance
    }

    movePaddleRight(distance) {
        this.data.paddle.x += distance
    }

    drawBall() {
        this.context.drawImage(this.ball_sprite_sheet, 0, 0, 4, 4, this.data.ball.x, this.data.ball.y, 4, 4)
    }

    checkBallCollisionWithPaddle() {
        let gap_x
        let gap_y

        if (this.data.ball.directions.x == -1) { // ball goes to left
            gap_x = this.data.ball.x - (this.data.paddle.x + (27 - 1)) - 1
        } else if (this.data.ball.directions.x == 1) { // ball goes to right
            gap_x = this.data.paddle.x - (this.data.ball.x + (4 - 1)) - 1
        }

        if (this.data.ball.directions.y == -1) { // ball goes to top
            gap_y = this.data.ball.y - (this.data.paddle.y + (6 - 1)) - 1
        } else if (this.data.ball.directions.y == 1) { // ball goes to bottom
            gap_y = this.data.paddle.y - (this.data.ball.y + (4 - 1)) - 1
        }


        if (gap_x == 0 && (this.data.paddle.y - (4 - 1) <= this.data.ball.y && this.data.ball.y <= this.data.paddle.y + (6 - 1))) {
            return {
                bool: true,
                section: 2,
                gap: 'gap_x',
                direction_x: this.data.ball.directions.x * -1,
                direction_y: this.data.ball.directions.y,
            }
        } else if (gap_y == 0 && (this.data.paddle.x - (4 - 1) <= this.data.ball.x && this.data.ball.x <= this.data.paddle.x + (27 - 1))) {
            let section
            // debugger
            if ((this.data.paddle.x - (4 - 1) <= this.data.ball.x && this.data.ball.x <= this.data.paddle.x + 3) || (this.data.paddle.x + 20 <= this.data.ball.x && this.data.ball.x <= this.data.paddle.x + 26)) {
                section = 2
                // debugger
            } else if (this.data.paddle.x + 4 <= this.data.ball.x && this.data.ball.x <= this.data.paddle.x + 19) {
                section = 1
                // debugger
            } else {
                ifLog.log('It should not go here hmmmmm.....')
                // debugger
            }
            return {
                bool: true,
                section: section,
                gap: 'gap_y',
                direction_x: this.data.ball.directions.x,
                direction_y: this.data.ball.directions.y * -1,
            }
        } else if (gap_x == 0 && gap_y == 0) {
            return {
                bool: true,
                section: 2,
                gap: 'both',
                direction_x: this.data.ball.directions.x * -1,
                direction_y: this.data.ball.directions.y * -1,
            }
        } else {
            return {
                bool: false
            }
        }
    }

    getBrickTranslatedPositon(brick_row, brick_column) {
        const offset_left = 8
        const offset_top = 21

        const dx = offset_left + ((brick_column - 1) * 8) // 8 = width + shadow = 7 + 1
        const dy = offset_top + ((brick_row - 1) * 4) // 4 = height + shadow = 3 + 1
        return { dx: dx, dy: dy }
    }

    checkBallCollisionWithBricks() {
        let collisions = []
        let sticky_surface

        const side_x = this.data.ball.directions.x == 1 ? 'left' : 'right'
        const side_y = this.data.ball.directions.y == 1 ? 'top' : 'bottom'
        if (side_x == 'left' && side_y == 'top') {
            ifLog.log('++++++ left top +++++')
            for (let row = 20; row >= 1; row--) {
                for (let column = 14; column >= 1; column--) {
                    if (this.data.bricks[`row_${row}`][`column_${column}`].color == undefined) {
                        continue
                    }
                    const translated_position = this.getBrickTranslatedPositon(row, column)

                    // check left
                    const gap_x = translated_position.dx - (this.data.ball.x + (4 - 1)) - 1
                    // check top
                    const gap_y = translated_position.dy - (this.data.ball.y + (4 - 1)) - 1

                    if (gap_x == 0 && (translated_position.dy - (4 - 1) <= this.data.ball.y && this.data.ball.y <= translated_position.dy + (3 - 1))) {
                        ifLog.log('gap_x == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger

                        if (this.data.ball.y < translated_position.dy) {
                            sticky_surface = 4 - (translated_position.dy - this.data.ball.y)
                        } else if (translated_position.dy <= this.data.ball.y) {
                            sticky_surface = 4 - ((this.data.ball.y - translated_position.dy) + 1)
                        }

                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface

                        })
                    } else if (gap_y == 0 && (translated_position.dx - (4 - 1) <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (7 - 1))) {
                        ifLog.log('gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger

                        if (this.data.ball.x < translated_position.dx) {
                            sticky_surface = 4 - (translated_position.dx - this.data.ball.x)
                        } else if (translated_position.dx <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (4 - 1)) {
                            sticky_surface = 4
                        } else if (translated_position.dx + 4 <= this.data.ball.x) {
                            sticky_surface = 4 - (((this.data.ball.x - translated_position.dx) + 1) - 4)
                        }

                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_y == 0 && gap_x == 0) {
                        ifLog.log('gap_x == 0  && gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        sticky_surface = 0
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    }

                }
            }

        } else if (side_x == 'left' && side_y == 'bottom') {
            ifLog.log('++++++ left bottom +++++')
            for (let row = 1; row <= 20; row++) {
                for (let column = 14; column >= 1; column--) {
                    if (this.data.bricks[`row_${row}`][`column_${column}`].color == undefined) {
                        continue
                    }
                    const translated_position = this.getBrickTranslatedPositon(row, column)
                    // ifLog.log(translated_position)
                    // check left
                    const gap_x = translated_position.dx - (this.data.ball.x + (4 - 1)) - 1
                    // check bottom
                    const gap_y = this.data.ball.y - (translated_position.dy + (3 - 1)) - 1

                    if (gap_x == 0 && (translated_position.dy - (4 - 1) <= this.data.ball.y && this.data.ball.y <= translated_position.dy + (4 - 1) - 1)) {
                        ifLog.log('gap_x == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        if (this.data.ball.y < translated_position.dy) {
                            sticky_surface = 4 - (translated_position.dy - this.data.ball.y)
                        } else if (translated_position.dy <= this.data.ball.y) {
                            sticky_surface = 4 - ((this.data.ball.y - translated_position.dy) + 1)
                        }
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_y == 0 && (translated_position.dx - (4 - 1) <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (7 - 1))) {
                        ifLog.log('gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        if (this.data.ball.x < translated_position.dx) {
                            sticky_surface = 4 - (translated_position.dx - this.data.ball.x)
                        } else if (translated_position.dx <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (4 - 1)) {
                            sticky_surface = 4
                        } else if (translated_position.dx + 4 <= this.data.ball.x) {
                            sticky_surface = 4 - (((this.data.ball.x - translated_position.dx) + 1) - 4)
                        }
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_x == 0 && gap_y == 0) {
                        ifLog.log('gap_x == 0  && gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        sticky_surface = 0
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    }
                }
            }

        } else if (side_x == 'right' && side_y == 'top') {
            ifLog.log('++++++ right top +++++')
            for (let row = 20; row >= 1; row--) {
                for (let column = 1; column <= 14; column++) {
                    if (this.data.bricks[`row_${row}`][`column_${column}`].color == undefined) {
                        continue
                    }
                    const translated_position = this.getBrickTranslatedPositon(row, column)

                    // check right
                    const gap_x = this.data.ball.x - (translated_position.dx + (7 - 1)) - 1
                    // check top
                    const gap_y = translated_position.dy - (this.data.ball.y + (4 - 1)) - 1

                    if (gap_x == 0 && (translated_position.dy - (4 - 1) <= this.data.ball.y && this.data.ball.y <= translated_position.dy + (3 - 1))) {
                        ifLog.log('gap_x == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        if (this.data.ball.y < translated_position.dy) {
                            sticky_surface = 4 - (translated_position.dy - this.data.ball.y)
                        } else if (translated_position.dy <= this.data.ball.y) {
                            sticky_surface = 4 - ((this.data.ball.y - translated_position.dy) + 1)
                        }
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_y == 0 && (translated_position.dx - (4 - 1) <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (7 - 1))) {
                        ifLog.log('gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger

                        if (this.data.ball.x < translated_position.dx) {
                            sticky_surface = 4 - (translated_position.dx - this.data.ball.x)
                        } else if (translated_position.dx <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (4 - 1)) {
                            sticky_surface = 4
                        } else if (translated_position.dx + 4 <= this.data.ball.x) {
                            sticky_surface = 4 - (((this.data.ball.x - translated_position.dx) + 1) - 4)
                        }

                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_y == 0 && gap_x == 0) {
                        ifLog.log('gap_x == 0  && gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        sticky_surface = 0
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    }
                }
            }

        } else if (side_x == 'right' && side_y == 'bottom') {
            ifLog.log('++++++ right bottom +++++')
            for (let row = 1; row <= 20; row++) {
                for (let column = 1; column <= 14; column++) {
                    if (this.data.bricks[`row_${row}`][`column_${column}`].color == undefined) {
                        continue
                    }
                    const translated_position = this.getBrickTranslatedPositon(row, column)
                    // ifLog.log(translated_position)
                    // check right
                    const gap_x = this.data.ball.x - (translated_position.dx + (7 - 1)) - 1
                    // check bottom
                    const gap_y = this.data.ball.y - (translated_position.dy + (3 - 1)) - 1

                    if (gap_x == 0 && (translated_position.dy - (4 - 1) <= this.data.ball.y && this.data.ball.y <= translated_position.dy + (3 - 1))) {
                        ifLog.log('gap_x == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        if (this.data.ball.y < translated_position.dy) {
                            sticky_surface = 4 - (translated_position.dy - this.data.ball.y)
                        } else if (translated_position.dy <= this.data.ball.y) {
                            sticky_surface = 4 - ((this.data.ball.y - translated_position.dy) + 1)
                        }
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_y == 0 && (translated_position.dx - (4 - 1) <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (7 - 1))) {
                        ifLog.log('gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        if (this.data.ball.x < translated_position.dx) {
                            sticky_surface = 4 - (translated_position.dx - this.data.ball.x)
                        } else if (translated_position.dx <= this.data.ball.x && this.data.ball.x <= translated_position.dx + (4 - 1)) {
                            sticky_surface = 4
                        } else if (translated_position.dx + 4 <= this.data.ball.x) {
                            sticky_surface = 4 - (((this.data.ball.x - translated_position.dx) + 1) - 4)
                        }
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    } else if (gap_x == 0 && gap_y == 0) {
                        ifLog.log('gap_x == 0  && gap_y == 0')
                        // ifLog.log(this.data.ball)
                        // ifLog.log({ row: row, column: column })
                        // debugger
                        sticky_surface = 0
                        collisions.push({
                            bool: false,
                            direction_x: this.data.ball.directions.x * -1,
                            direction_y: this.data.ball.directions.y * -1,
                            brick: {
                                row: row,
                                column: column,
                            },
                            side_x: side_x,
                            side_y: side_y,
                            gap_x: gap_x,
                            gap_y: gap_y,
                            sticky_surface: sticky_surface
                        })
                    }
                }
            }
        }

        let resp
        if (collisions.length > 0) {
            ifLog.log(collisions)
            if (collisions.length == 3) {
                ifLog.log('bounce flip x and y')
                //   
                //   AB
                //   PA
                //   
                //   A -> bloczek obok piłki
                //   B -> bloczek naprzeciwko piłki
                //   P -> piłka
                // powienien usunąć dwa bloczki z którymi piłka się styka oprócz tego który jest na przeciwko (na rysunku oznaczony jako B)
                // i flipnąć dwie osie ruchu
                let bricks_to_delete = []
                for (let brick of collisions) {
                    if (!(brick.direction_x != this.data.ball.directions.x && brick.direction_y != this.data.ball.directions.y)) {
                        bricks_to_delete.push({ row: brick.brick.row, column: brick.brick.column })
                    }
                }
                resp = {
                    bool: false,
                    direction_x: this.data.ball.directions.x * -1,
                    direction_y: this.data.ball.directions.y * -1,
                    bricks_to_delete: bricks_to_delete
                }
                // return resp
            } else if (collisions.length == 2) {
                ifLog.log('bounce like in first or second if bricks are in line or flip both axes if bricks aren\'t in line')
                // TODO:
                // FIXME:

                //    I:
                //    I.a                                ||  I.b 
                //    AA                                 ||  A    
                //     P     piłka leci w lewy górny róg ||  AP  
                //    
                //    II:
                //    
                //     A
                //    AP      piłka leci w lewy górny róg
                //    
                // I:
                // powinien flipnąć tylko jedną oś (tą od której się odbił z klockiem do którego miałe większą powierzchnię styczną) 
                // a nie np. od tego z którym był na rogu i chce flipnąć dwie osie
                // trzba policzyć jakoś sprytnie ta powierzchnię
                // powinien tez usunąć tylko jeden blok (ten który ustawia nowy kierunek, x większą powierzchnią styczną)
                // 
                // II:
                // powinien flipnąć dwie osie oraz usunąć dwa bloczki


                let same_row = collisions[0].brick.row == collisions[1].brick.row
                let same_column = collisions[0].brick.column == collisions[1].brick.column
                collisions.sort((a, b) => b.sticky_surface - a.sticky_surface) // the first one (index 0) element of this array will be the one with the hightes sticky_surface

                if (same_row == true && same_column == false) {
                    // variant I.a
                    resp = {
                        bool: false,
                        direction_x: this.data.ball.directions.x,
                        direction_y: this.data.ball.directions.y * -1,
                        bricks_to_delete: [
                            { row: collisions[0].brick.row, column: collisions[0].brick.column },
                        ]
                    }

                } else if (same_row == false && same_column == true) {
                    // variant I.b
                    resp = {
                        bool: false,
                        direction_x: this.data.ball.directions.x * -1,
                        direction_y: this.data.ball.directions.y,
                        bricks_to_delete: [
                            { row: collisions[0].brick.row, column: collisions[0].brick.column },
                        ]
                    }

                } else if (same_row == false && same_column == false) {
                    // variant II
                    resp = {
                        bool: false,
                        direction_x: this.data.ball.directions.x * -1,
                        direction_y: this.data.ball.directions.y * -1,
                        bricks_to_delete: [
                            { row: collisions[0].brick.row, column: collisions[0].brick.column },
                            { row: collisions[1].brick.row, column: collisions[1].brick.column }
                        ]
                    }
                }

                // return resp
            } else if (collisions.length == 1) {
                ifLog.log('bounce like in first')
                resp = {
                    bool: false,
                    direction_x: collisions[0].direction_x,
                    direction_y: collisions[0].direction_y,
                    bricks_to_delete: [
                        { row: collisions[0].brick.row, column: collisions[0].brick.column }
                    ]
                }
                // return resp

            }
            // debugger
            return resp
        } else {
            return {
                bool: true,
                // distance_x: gap_x >= this.data.ball.speed ? this.data.ball.speed : gap_x,
                // distance_y: gap_y >= this.data.ball.speed ? this.data.ball.speed : gap_y
            }
        }

        // const gap_left_x = 0
        // const gap_right_x = 0
        // const gap_top_y = 0
        // const gap_bottom_y = 0
    }

    destroyBricks(bricks) {
        for (let brick of bricks) {
            this.data.bricks[`row_${brick.row}`][`column_${brick.column}`].color = undefined
        }
    }

    checkIfGameWasWon() {
        for (let row = 1; row <= this.rows; row++) {
            for (let column = 1; column <= this.columns; column++) {
                if (this.data.bricks[`row_${row}`][`column_${column}`].color != undefined) {
                    return false
                }
            }
        }
        return true
    }


    checkCornersCollisionsWithBricks(corners) {
        for (let corner of Object.values(corners)) {
            for (let brick_row = 1; brick_row <= this.rows; brick_row++) {
                for (let brick_column = 1; brick_column <= this.columns; brick_column++) {

                    let brick_left_top = this.getBrickTranslatedPositon(brick_row, brick_column)

                    const between_x = ((brick_left_top.dx <= corner.x) && (corner.x <= brick_left_top.dx + (7 - 1)))
                    const between_y = ((brick_left_top.dy <= corner.y) && (corner.y <= brick_left_top.dy + (3 - 1)))
                    const brick_exists = (this.data.bricks[`row_${brick_row}`][`column_${brick_column}`].color != undefined)
                    if (between_x == true && between_y == true && brick_exists == true) {
                        return true
                    }

                }
            }
        }
        return false
    }

    canMoveBall() {
        // ball: {
        //     x: 62,
        //     y: 102,
        //     // angle: 45,
        //     speed: 1,
        //     directions: {
        //         //        -1
        //         //         │
        //         //         │
        //         // -1 ─────┼─────► 1
        //         //         │     x
        //         //         │
        //         //         ▼ y
        //         //         1
        //         x: 1,
        //         y: -1,
        //     },
        // },





        const current_ball_direction_x = this.data.ball.directions.x == -1 ? 'left' : 'right'
        const current_ball_direction_y = this.data.ball.directions.y == -1 ? 'top' : 'bottom'


        // wiem że na pewno miejsce na którym jestem nie ma klocka ani paletki ani sciany
        // ja jestem == piłka jest
        // wiem, że nie jestem obok żadnego klocka, bo jesli byłem obok klocka, to klocek został już zbity oraz zmienił się odpowiednio kierunek piłki
        // oraz że musze sprawdzic tylko czy nie ma zadnego klocka przede mną
        // przede mną == w miejscu gdzie znalazłaby się piłka po przesunięciu o wektor w danym kierunku

        // algorytm :
        // w 2 petlach sprawdzam od bazowego wysunietego naroznika przesuniecie o bazowy wektor aż do wektora (1,1) : (nie moze byc (0,0)(0,1)(1,0) bo wtedy nie zmianiałyby się współrzędne na obu osiach)
        //   biore współrzędne najbardziej wysyniętego w kierunku ruchu piłki narożnika piłeczki
        //   przesuwam te współrzędne o wektor z danych z pętli, odbity odpowiednio w aktualny kierunek lotu piłki
        //   sprawdzam czy po przesunięciu ten wierzchołek oraz 2 pozostałe po bokach najdą na jakikolwiek klocek (klocek ma wymiary 7x3, wiec nie biore pod uwage cieni) (pomijam wektor który jest z tyłu)
        //   jeśli żaden nie najdzie to klocek można przesunąć o uzyskany w pętli wektor, który jest najdłuższym mozliwym do uzyskania wektorem w tej petli

        let corners = {}

        if (current_ball_direction_x == 'left' && current_ball_direction_y == 'top') {
            corners = {
                left: { x: this.data.ball.x, y: this.data.ball.y + (4 - 1) },
                front: { x: this.data.ball.x, y: this.data.ball.y },
                right: { x: this.data.ball.x + (4 - 1), y: this.data.ball.y }
            }
        } else if (current_ball_direction_x == 'right' && current_ball_direction_y == 'top') {
            corners = {
                left: { x: this.data.ball.x, y: this.data.ball.y },
                front: { x: this.data.ball.x + (4 - 1), y: this.data.ball.y },
                right: { x: this.data.ball.x + (4 - 1), y: this.data.ball.y + (4 - 1) }
            }
        } else if (current_ball_direction_x == 'right' && current_ball_direction_y == 'bottom') {
            corners = {
                left: { x: this.data.ball.x + (4 - 1), y: this.data.ball.y },
                front: { x: this.data.ball.x + (4 - 1), y: this.data.ball.y + (4 - 1) },
                right: { x: this.data.ball.x, y: this.data.ball.y + (4 - 1) }
            }
        } else if (current_ball_direction_x == 'left' && current_ball_direction_y == 'bottom') {
            corners = {
                left: { x: this.data.ball.x + (4 - 1), y: this.data.ball.y + (4 - 1) },
                front: { x: this.data.ball.x, y: this.data.ball.y + (4 - 1) },
                right: { x: this.data.ball.x, y: this.data.ball.y }
            }
        }

        let good_vector = {}
        let breaker = false
        if (!(this.data.ball.speed == 1 || this.data.ball.speed == 2)) {

            // debugger
        }
        for (let vector_x = this.data.ball.vectors[`vector_${this.data.ball.speed}`].x; vector_x >= 1; vector_x--) {
            for (let vector_y = this.data.ball.vectors[`vector_${this.data.ball.speed}`].y; vector_y >= 1; vector_y--) {
                // for (let vector_x = this.data.ball.vectors[`vector_2`].x; vector_x >= 1; vector_x--) {
                //     for (let vector_y = this.data.ball.vectors[`vector_2`].y; vector_y >= 1; vector_y--) {
                let corners_moved_by_vector = {
                    left: { x: corners.left.x + (vector_x * this.data.ball.directions.x), y: corners.left.y + (vector_y * this.data.ball.directions.y) },
                    front: { x: corners.front.x + (vector_x * this.data.ball.directions.x), y: corners.front.y + (vector_y * this.data.ball.directions.y) },
                    right: { x: corners.right.x + (vector_x * this.data.ball.directions.x), y: corners.right.y + (vector_y * this.data.ball.directions.y) }
                }

                let check_corners_collisions_with_bricks = this.checkCornersCollisionsWithBricks(corners_moved_by_vector)
                if (check_corners_collisions_with_bricks == false) {
                    good_vector = {
                        x: vector_x,
                        y: vector_y
                    }
                    breaker = true
                }
                if (breaker == true) {
                    break
                }
            }
            if (breaker == true) {
                break
            }
        }
        ifLog.log('good_vector: ')
        ifLog.log(good_vector)






        let gap_x //gap to left or right edge based on x direction
        let gap_y //gap to top or bottom edge based on y direction
        if (this.data.ball.directions.x < 0) { // goes left
            gap_x = this.data.ball.x - 8
        } else if (this.data.ball.directions.x > 0) {  // goes right
            gap_x = 119 - (this.data.ball.x + 4 - 1)
        }

        if (this.data.ball.directions.y < 0) { // goes up
            gap_y = this.data.ball.y - 21
        } else if (this.data.ball.directions.y > 0) { // goes down
            gap_y = 127 - (this.data.ball.y + 4 - 1)
        }

        if (gap_x > 0 && gap_y > 0) {  // jeśli jest jakaś odległość od ściany , to zwraca o ile można ruszyć piłką, żeby nie clipowała sie w ścianę
            // trzeba jakoś sprytnie jeszcze wziąć pod uwagę good_vector z kolicji piłki z bloczkami 
            if (good_vector.x != this.data.ball.vectors[`vector_${this.data.ball.speed}`].x || good_vector.y != this.data.ball.vectors[`vector_${this.data.ball.speed}`].y) {// jeśli jest poprawka trajektorii lotu przez bloczki
                return {
                    bool: true,
                    distance_x: good_vector.x,
                    distance_y: good_vector.y
                }
            } else { // poprawka tylko i wyłącznie ze wględy na ściany
                return {
                    bool: true,
                    distance_x: gap_x >= this.data.ball.vectors[`vector_${this.data.ball.speed}`].x ? this.data.ball.vectors[`vector_${this.data.ball.speed}`].x : gap_x,
                    distance_y: gap_y >= this.data.ball.vectors[`vector_${this.data.ball.speed}`].y ? this.data.ball.vectors[`vector_${this.data.ball.speed}`].y : gap_y
                }
            }
            // } else if (gap_x == 0 || gap_y == 0) { // jeśli jest przy jakiejś ze ścian to podaje nowe wektory kierunkowe
        } else { // jeśli jest przy jakiejś ze ścian to podaje nowe wektory kierunkowe
            return {
                bool: false,
                direction_x: gap_x > 0 ? this.data.ball.directions.x : this.data.ball.directions.x * -1,
                direction_y: gap_y > 0 ? this.data.ball.directions.y : this.data.ball.directions.y * -1
            }
        }
        // }
    }

    bounceBall(axis) {
        this.data.ball.directions[axis] *= -1
    }

    moveBall(distance_x, distance_y) {
        this.data.ball.x += (distance_x * this.data.ball.directions.x)
        this.data.ball.y += (distance_y * this.data.ball.directions.y)
    }

    changePixel(canvas, cords, color) {
        // colors should be 0 <= intigers <=255
        // color = {red:0, green:2, blue:3, alpha:255}
        //    alpha where 0 is fully transparent and 255 is solid non transparent color 
        // cords = [{x:0, y:1},{x:0, y:2}] etc.
        const ctx = canvas.getContext('2d')
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // [   r,g,b,a
        //     0,1,2,3,
        //     4,5,6,7,
        //     8,9,10,11
        // ]
        for (let cord of cords) {
            const offset = (cord.y * canvas.width + cord.x) * 4

            imgData.data[offset] = color.red
            imgData.data[offset + 1] = color.green
            imgData.data[offset + 2] = color.blue
            imgData.data[offset + 3] = color.alpha

        }

        ctx.putImageData(imgData, 0, 0)
    }



    redraw() {
        if (this.game_ended == true) {
            alert('Przegrałeś')
            window.location.reload()
        } else if (this.checkIfGameWasWon() == true) {
            alert('Wygrałeś')
            window.location.reload()
        } else {
            requestAnimationFrame(() => { this.redraw() })
            this.skipped_frames++
        }

        if (this.skipped_frames >= document.getElementById('frame_skipper').value) {
            this.skipped_frames = 0

            ifLog.log('------------ Render ------------')
            this.clearCanvas()
            this.drawBackgroundTiles()
            this.drawLeftAndTopBarrier()

            // check ball collisions and if they exist, remove blocks and flip appropriate axes
            let check_collisions = this.checkBallCollisionWithBricks()
            if (check_collisions.bool == false) {
                this.destroyBricks(check_collisions.bricks_to_delete)
                if (check_collisions.direction_x != this.data.ball.directions.x) {
                    this.bounceBall('x')
                }
                if (check_collisions.direction_y != this.data.ball.directions.y) {
                    this.bounceBall('y')
                }
            }

            // redraw bricks
            for (let [row_key, row_value] of Object.entries(this.data.bricks)) {
                const brick_row = row_key.split('_')[1]
                // ifLog.log(`brick_row: ${brick_row}`)
                for (let [column_key, column_value] of Object.entries(row_value)) {
                    const brick_column = column_key.split('_')[1]
                    // ifLog.log(`brick_column: ${brick_column}`)
                    if (column_value.color != undefined) {
                        // ifLog.log(`${row_key} ${column_key} color: ${column_value.color}`)
                        this.drawBrick(column_value.color, brick_row, brick_column)
                    }
                }
            }

            // change paddle position
            if (Config.move_left == true) {
                const can_move_paddle_left = this.canMovePaddle('left')
                if (can_move_paddle_left.bool == true) {
                    this.movePaddleLeft(can_move_paddle_left.distance)
                }
            } else if (Config.move_right == true) {
                const can_move_paddle_right = this.canMovePaddle('right')
                if (can_move_paddle_right.bool == true) {
                    this.movePaddleRight(can_move_paddle_right.distance)
                }
            }

            this.drawPaddle()

            let check_ball_collision_with_paddle = this.checkBallCollisionWithPaddle()
            if (check_ball_collision_with_paddle.bool == true) {
                //collision with paddle
                // debugger
                this.data.ball.speed = check_ball_collision_with_paddle.section
                if (this.data.ball.speed == 2) {
                    this.data.ball.speed = 1
                    // document.getElementById('frame_skipper').value = 2
                    // debugger
                } else {
                    this.data.ball.speed = 2
                    // document.getElementById('frame_skipper').value = 0
                    // debugger
                }
                // debugger

                if (check_ball_collision_with_paddle.direction_x != this.data.ball.directions.x) {
                    this.bounceBall('x')
                }
                if (check_ball_collision_with_paddle.direction_y != this.data.ball.directions.y) {
                    this.bounceBall('y')
                }
            }


            // change ball position and direction
            const can_move_ball = this.canMoveBall()
            if (can_move_ball.bool == true) {
                this.moveBall(can_move_ball.distance_x, can_move_ball.distance_y)
                if (this.data.ball.y == 124) {
                    ifLog.log('Game_ should end here🤖')
                    this.game_ended = true
                }
            } else if (can_move_ball.bool == false) {
                if (can_move_ball.direction_x != this.data.ball.directions.x) {
                    this.bounceBall('x')
                }
                if (can_move_ball.direction_y != this.data.ball.directions.y) {
                    this.bounceBall('y')
                }
                const can_move_ball_v2 = this.canMoveBall()
                this.moveBall(can_move_ball_v2.distance_x, can_move_ball_v2.distance_y)
            }

            this.drawBall()

            this.drawRightBarrier()
        }

        // if (this.game_ended == true) {
        //     debugger
        //     this.drawBall()
        //     debugger
        //     alert('Przegrałeś')
        //     debugger
        //     // window.location.reload()
        // } else if (this.checkIfGameWasWon() == true) {
        //     debugger
        //     alert('Wygrałeś')
        //     debugger
        //     // window.location.reload()
        // }
        // requestAnimationFrame(async () => { await this.redraw() })
        // this.skipped_frames++

    }
}
