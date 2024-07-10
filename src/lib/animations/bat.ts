export default {
    Idle: {
        strip: { x: 168, y: 0, frames: 1, duration: 0 },
        width: 28,
        height: 20,
        offset: [-10, -2],
        loop: false
    },
    Fly: {
        strip: { x: 0, y: 0, frames: 6, duration: 80 },
        width: 28,
        height: 20,
        offset: [-12, 0],
        loop: true
    },
    Fall: {
        strip: { x: 196, y: 0, frames: 1, duration: 0 },
        width: 28,
        height: 20,
        offset: [-12, -2],
        loop: false
    }
}
