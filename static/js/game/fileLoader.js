import ifLog from '/static/js/consoleLogWrapper.js'

export default class FileLoader {
    static getData(file) {
        return new Promise((resolve, reject) => {
            // ifLog.log(file)
            let reader = new FileReader()
            reader.readAsText(file, "utf-8");
            reader.onload = () => {
                let data = JSON.parse(reader.result)
                // ifLog.log(data)
                resolve(data)
            }
        })
    }
}