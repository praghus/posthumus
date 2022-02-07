export default {
    IDLE: {
        strip: { x: 168, y: 0, frames: 1, duration: 0 },
        width: 28,
        height: 20,
        bounds: [5, 0, 18, 14],
        loop: false
    },
    RIGHT: {
        strip: { x: 0, y: 0, frames: 6, duration: 60 },
        width: 28,
        height: 20,
        bounds: [5, 0, 18, 14],
        loop: true
    },
    LEFT: {
        strip: { x: 0, y: 20, frames: 6, duration: 60 },
        width: 28,
        height: 20,
        bounds: [5, 0, 18, 14],
        loop: true
    },
    FALL: {
        strip: { x: 168, y: 20, frames: 1, duration: 0 },
        width: 28,
        height: 20,
        bounds: [5, 0, 18, 14],
        loop: false
    }
}
