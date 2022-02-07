export default {
    IDLE: {
        strip: { x: 0, y: 0, frames: 4, duration: 200 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: true
    },
    WALK: {
        strip: { x: 212, y: 0, frames: 8, duration: 80 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: true
    },
    JUMP: {
        strip: { x: 636, y: 0, frames: 5, duration: 100 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: false
    },
    FALL: {
        strip: { x: 848, y: 0, frames: 1, duration: 0 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: false
    },
    SHOOT: {
        strip: { x: 901, y: 0, frames: 5, duration: 80 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: false
    },
    HURT: {
        strip: { x: 1325, y: 0, frames: 3, duration: 100 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: true
    },
    RELOAD: {
        strip: { x: 1484, y: 0, frames: 3, duration: 300 },
        width: 53,
        height: 53,
        bounds: [18, 16, 18, 37],
        loop: true
    }
}
