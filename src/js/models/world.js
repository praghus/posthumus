export default class World {
    constructor (data) {
        const backgroundLayer = data.layers[0].data
        const mainLayer = data.layers[1].data
        const objectsLayer = data.layers[2].objects
        const foregroundLayer = data.layers[3].data

        this.width = parseInt(data.width)
        this.height = parseInt(data.height)
        this.gravity = 0.4// parseFloat(data.properties.gravity)
        this.surface = parseInt(data.properties.surfaceLevel)
        this.spriteSize = parseInt(data.tilewidth)
        this.spriteCols = parseInt(data.tilesets[0].columns)
        this.playerData = null
        this.objectsData = []
        this.data = { back: [], ground: [], mask: [], fore: [] }

        for (let i = 0; i < this.width; i++) {
            this.data.back[i] = []
            this.data.ground[i] = []
            this.data.mask[i] = []
            this.data.fore[i] = []
        }

        let j = 0
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.data.ground[x][y] = mainLayer[j]
                this.data.back[x][y] = backgroundLayer[j]
                this.data.fore[x][y] = foregroundLayer[j]
                this.data.mask[x][y] = 0
                j++
            }
        }

        for (let i = 0; i < objectsLayer.length; i++) {
            const obj = objectsLayer[i]
            switch (obj.type) {
            case 'player':
                this.playerData = obj
                break
            default:
                this.objectsData.push(obj)
                break
            }
        }
    }

    getPlayer () {
        return this.playerData
    }

    getObjects () {
        return this.objectsData
    }

    inRange (x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height
    }

    get (l, x, y) {
        if (!this.inRange(x, y)) {
            return false
        }
        return this.data[l][x][y]
    }

    tileData (x, y) {
        return {
            x: this.spriteSize * x,
            y: this.spriteSize * y,
            width: this.spriteSize,
            height: this.spriteSize,
            type: this.get('ground', x, y),
            solid: this.isSolid(x, y)
        }
    }

    clearTile (x, y, layer) {
        if (this.inRange(x, y)) {
            this.data[layer][x][y] = null
        }
    }

    isSolid (x, y) {
        if (!this.inRange(x, y)) {
            return true
        }
        return this.data.ground[x][y] > 32 * 4
    }

    isShadowCaster (x, y) {
        if (!this.inRange(x, y)) {
            return false
        }
        return this.data.ground[x][y] > 32 * 4 || this.data.ground[x][y] === 1
    }

    addMask (obj) {
        const x = Math.round(obj.x / this.spriteSize) - 1
        const y = Math.round(obj.y / this.spriteSize) - 1
        const w = Math.round(obj.width / this.spriteSize) + 2
        const h = Math.round(obj.height / this.spriteSize) + 2
        for (let _y = y; _y < y + h; _y++) {
            for (let _x = x; _x < x + w; _x++) {
                this.data.mask[_x][_y] = 1
            }
        }
    }
}
