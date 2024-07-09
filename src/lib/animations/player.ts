export default {
    Idle: {
        strip: { x: 0, y: 0, frames: 4, duration: 200 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: true
    },
    Walk: {
        strip: { x: 212, y: 0, frames: 8, duration: 80 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: true
    },
    Jump: {
        strip: { x: 636, y: 0, frames: 5, duration: 200 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: false
    },
    Fall: {
        strip: { x: 848, y: 0, frames: 1, duration: 0 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: false
    },
    Shoot: {
        strip: { x: 901, y: 0, frames: 5, duration: 140 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: false
    },
    Hurt: {
        strip: { x: 1325, y: 0, frames: 3, duration: 100 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: true
    },
    Reload: {
        strip: { x: 1484, y: 0, frames: 3, duration: 300 },
        width: 53,
        height: 53,
        offset: [-18, -12.5],
        loop: true
    }
}
