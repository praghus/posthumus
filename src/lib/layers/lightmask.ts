import { Layer, Scene } from 'tiled-platformer-lib'
import { Circle, Polygon, Point, DarkMask, LineOfSight } from 'lucendi'
import { LAYERS } from '../constants'

export default class Lightmask extends Layer {
    public id = LAYERS.CUSTOM_LIGHT

    draw (ctx: CanvasRenderingContext2D, scene: Scene): void {
        if (scene.getProperty('inDark')) {
            const { resolutionX, resolutionY } = scene.viewport
            const boundaries = []
            const lights = []

            scene.forEachVisibleObject(LAYERS.LIGHTS, (obj) => {
                obj.light && lights.push(obj.getLight(scene))
            })
            scene.forEachVisibleObject(LAYERS.OBJECTS, (obj) => {
                obj.light && lights.push(obj.getLight(scene))
                obj.shadowCaster && boundaries.push(obj.getLightMask(scene))
            })
            scene.forEachVisibleTile(LAYERS.MAIN, (tile, x, y) => {
                if (tile && tile.isSolid() && !tile.isOneWay()) {
                    tile.collisionMasks.map(({ points }) => boundaries.push(Lightmask.rect(x, y, points)))
                }
            })
            ctx.globalCompositeOperation = 'lighter'
            for (const light of lights) {
                const l = new LineOfSight(light, boundaries)
                l.buffer(resolutionX, resolutionY)
                l.render(ctx)
            }
            ctx.globalCompositeOperation = 'source-over'
            const d = new DarkMask(lights)
            d.buffer(resolutionX, resolutionY)
            d.render(ctx)
        }
    }
    
    static rect = (x: number, y: number, points: any[]): Polygon => 
        new Polygon(points.map((v) => new Point(v.x + x, v.y + y)))

    static disc = (x: number, y: number, radius: number): Circle => 
        new Circle(new Point(x + radius, y + radius), radius)
}