export default class Camera {
    constructor (game) {
        this._game = game
        this.x = 0
        this.y = 0
        this.underground = false
        this.rector = 2
        this.a = 1
    }
    /* todo: attatch entity to follow */
    update () {
        const { player, world, viewport } = this._game
        const { resolutionX, resolutionY } = viewport
        const { spriteSize, surface } = world

        if ((player.x + (player.width / 2)) + this.x > resolutionX / 2) {
            this.x -= player.force.x > 0 ? player.force.x : 0.5
        }
        if ((player.x + (player.width / 2)) + this.x < resolutionX / 2) {
            this.x -= player.force.x < 0 ? player.force.x : -0.5
        }
        if (this.x > 0) {
            this.x = 0
        }
        if (this.x - resolutionX < -world.width * spriteSize) {
            this.x = (-world.width * spriteSize) + resolutionX
        }
        this.y = -((player.y + player.height) - (resolutionY / 1.2))
        if (this.y > 0) {
            this.y = 0
        }
        // above the surface
        if (Math.round((player.y + (player.height / 2)) / spriteSize) < surface) {
            this.underground = false
            if ((this.y - resolutionY) < -surface * spriteSize) {
                this.y = (-surface * spriteSize) + resolutionY
            }
        }
        else {
            // under the surface
            this.underground = true
            if ((this.y) >= -surface * spriteSize) {
                this.y = (-surface * spriteSize)
            }
        }
        if (this.y - resolutionY < -world.height * spriteSize) {
            this.y = (-world.height * spriteSize) + resolutionY
        }
        // shake
        if (this.rector !== 2) {
            if (this.a === 1) {
                this.y = this.y + this.rector
            }
            else if (this.a === 2) {
                this.x = this.x + this.rector
            }
            else if (this.a === 3) {
                this.y = this.y - this.rector
            }
            else {
                this.x = this.x - this.rector
            }
            if (this.a < 4) {
                this.a++
            }
            else {
                this.a = 1
            }
        }
    }

    center () {
        const { player, viewport } = this._game
        const { resolutionX, resolutionY } = viewport

        this.x = -((player.x + (player.width / 2)) - (resolutionX / 2))
        this.y = -((player.y + player.height) - (resolutionY / 2))
    }

    shake () {
        if (this.rector < 0) {
            this.rector = 2
            return
        }
        this.rector -= 0.2
        setTimeout(() => this.shake(), 50)
    }
}
