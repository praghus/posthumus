import { Layer } from 'tiled-platformer-lib'
import { ENTITIES_TYPE, IMAGES, LAYERS } from '../constants'

export default class Overlay extends Layer {
    public id = LAYERS.CUSTOM_OVERLAY

    draw (ctx: CanvasRenderingContext2D, scene: TPL.Scene): void {
        const { images, viewport: { resolutionX, resolutionY }} = scene
        const player: any = scene.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)
        const write = this.text(ctx, images[IMAGES.FONT_SMALL], 5)
        
        const energy = (player.energy[0] / 10) * 4
        ctx.drawImage(images[IMAGES.ENERGY_STRIP], 2, 2)
        ctx.drawImage(images[IMAGES.ENERGY], 0, 0, energy, 4, 18, 5, energy, 4)
        
        const [ammo, maxAmmo] = player.ammo
        write('AMMO', resolutionX - 25 - (maxAmmo * 3), resolutionY - 9)
        for (let i = 0; i < maxAmmo; i++) {
            ctx.drawImage(
                images[IMAGES.AMMO], i < ammo ? 0 : 3, 0, 4, 8, 
                resolutionX - 7 - (i * 3), resolutionY - 11, 4, 8
            )
        }
    }

    text = (
        ctx: CanvasRenderingContext2D, 
        image: HTMLImageElement, 
        size: number
    ): any => (text: string, x: number, y: number) => text.split('\n').reverse().map((output, index) => {
        for (let i = 0; i < output.length; i++) {
            const chr = output.charCodeAt(i)
            ctx.drawImage(image,
                ((chr) % 16) * size, Math.ceil(((chr + 1) / 16) - 1) * size, size, size,
                Math.floor(x + (i * size)), Math.floor(y - (index * (size + 1))), size, size
            )
        }
    })
}
