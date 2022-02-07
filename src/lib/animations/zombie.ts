export default {
    IDLE: {
        strip: { x: 0, y: 0, frames: 9, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 12, 10, 30],
        loop: true
    },
    WALK: {
        strip: { x: 522, y: 0, frames: 12, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 12, 10, 30],
        loop: true
    },
    RUN: {
        strip: { x: 1218, y: 0, frames: 8, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 12, 10, 30],
        loop: true
    },
    ATTACK: {
        strip: { x: 1682, y: 0, frames: 11, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 12, 10, 30],
        loop: true
    },
    HURT1: {
        strip: { x: 2320, y: 0, frames: 13, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 32, 10, 10],
        loop: false
    },
    HURT2: {
        strip: { x: 3074, y: 0, frames: 15, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 32, 10, 10],
        loop: false
    },
    RISE: {
        strip: { x: 3944, y: 0, frames: 9, duration: 100 },
        width: 58,
        height: 46,
        bounds: [24, 32, 10, 10],
        loop: false
    }
}
