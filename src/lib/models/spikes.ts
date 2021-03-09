import { Entity, Scene } from 'tiled-platformer-lib'
import { StringTMap } from '../types'
import { randomInt } from '../helpers'
import { ENTITIES_FAMILY, IMAGES, LAYERS } from '../constants'
import ANIMATIONS from '../animations/shine'

export class Spikes extends Entity {
    public image = IMAGES.SHINE
    public animation = ANIMATIONS.SHINE
    public family = ENTITIES_FAMILY.TRAPS
    public collisionLayers = [LAYERS.MAIN]
    public damage = 1000
    
    private canAnimate = true
    private shineX = 0

    constructor (obj: StringTMap<any>) {
        super(obj)
        this.setBoundingBox(0, 8, this.width, this.height)
    }

    public draw (ctx: CanvasRenderingContext2D, scene: Scene): void {
        if (scene.onScreen(this)) {
            const { width, height, strip: { x, y } } = this.animation
            const { camera, images } = scene
            ctx.drawImage(images[this.image],
                x + this.sprite.animFrame * width, y, width, height,
                this.x + this.shineX + camera.x, this.y + camera.y - 2, width, height
            )
        }
    }

    public update (scene: Scene): void {
        if (scene.onScreen(this)) {
            if (this.canAnimate && this.sprite.animFrame === this.animation.strip.frames - 1) {
                this.canAnimate = false
                scene.startTimeout(`spikes-${this.id}-awake`, 2000, () => {
                    this.canAnimate = true
                    this.sprite.animFrame = 0
                    this.shineX = randomInt(0, (this.width - 8) / 8) * 8 
                })
            }
            this.sprite.animate(this.animation)
        }
    }
}