import { Entity } from 'tiled-platformer-lib'
import { COLORS, IMAGES } from '../constants'

export class Torch extends Entity {
    public image = IMAGES.TORCH
    public radius = 64

    constructor (obj: StringTMap<any>) {
        super(obj)
        this.y -= this.height
        this.addLightSource(COLORS.TORCH, 32, 16)
    }
}
