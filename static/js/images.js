export default class Images {
    static array = [
        'sprite_sheet'
    ]

    static async loadImages() {
        Images.images = Object.fromEntries(
            await Promise.all(
                Images.array.map(name => {
                    return new Promise((resolve, reject) => {
                        let newImage = new Image
                        newImage.src = `./static/img/${name}.png`
                        newImage.addEventListener('load', () => {
                            resolve([name, newImage])
                        })
                    })
                })
            )
        )
    }

    static getImage(name) {
        return Images.images[name.toString()]
    }
}