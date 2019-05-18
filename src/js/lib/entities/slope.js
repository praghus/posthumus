import ActiveElement from '../models/active-element'

export default class Slope extends ActiveElement {
    constructor (obj, game) {
        super(obj, game)
        this.solid = false
        this.visible = false
        const [minX, minY, maxX, maxY] = [
            Math.min.apply(Math, this.points.map((row) => Math.min(row[0]))),
            Math.min.apply(Math, this.points.map((row) => Math.min(row[1]))),
            Math.max.apply(Math, this.points.map((row) => Math.max(row[0]))),
            Math.max.apply(Math, this.points.map((row) => Math.max(row[1])))
        ]
        this.bounds = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        }
    }

    collide (element) {
        if (!this.dead && element.solid) {
            const posX = Math.ceil(element.x + (element.width / 2))
            // @todo: array.reduce instead of regular iteration
            for (let p = 0; p < this.points.length - 1; p++) {
                if (
                    (this.points[p][0] + this.x < posX && this.points[p + 1][0] + this.x >= posX) ||
                    (this.points[p][0] + this.x >= posX && this.points[p + 1][0] + this.x < posX)
                ) {
                    const edge = [
                        [this.points[p][0] + this.x, this.points[p][1] + this.y],
                        [this.points[p + 1][0] + this.x, this.points[p + 1][1] + this.y]
                    ]
                    const [tx, ty, tw, th] = [
                        Math.min(edge[0][0], edge[1][0]),
                        Math.min(edge[0][1], edge[1][1]),
                        Math.abs(edge[1][0] - edge[0][0]),
                        Math.abs(edge[1][1] - edge[0][1])
                    ]
                    const [calculatedX, calculatedY] = [posX, ty - element.height]
                    const delta = th / tw
                    const expectedY =
                        (edge[0][0] < edge[1][0] && edge[0][1] < edge[1][1]) ||
                        (edge[0][0] > edge[1][0] && edge[0][1] > edge[1][1])
                            ? calculatedY + (calculatedX - tx) * delta
                            : calculatedY + th - (calculatedX - tx) * delta
                    if (expectedY + element.height > element.y - element.height) {
                        if (element.y >= expectedY && !element.jump) {
                            element.y = expectedY
                            element.force.y = 0
                            element.fall = false
                            element.onFloor = true
                        }
                    }
                    break
                }
            }
        }
    }
}
