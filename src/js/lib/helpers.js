import './illuminated'
import { ENTITIES } from './entities'
import { JUMP_THROUGH_TILES, INPUT_KEYS, MINI_TILES } from './constants'

export const noop = () => {}

export function requireAll (requireContext) {
    return requireContext.keys().map(requireContext)
}

export function calculateViewportSize (width, height) {
    const pixelScale = height / 132
    const x = Math.round(width / pixelScale)
    const y = Math.round(height / pixelScale)

    return {
        width: Math.round(width / x) * x,
        height: Math.round(height / y) * y,
        scale: Math.round(width / x),
        resolutionX: x,
        resolutionY: y
    }
}

export function brighten (hex, percent) {
    const a = Math.round(255 * percent / 100)
    const r = normalize(a + parseInt(hex.substr(1, 2), 16), 0, 256)
    const g = normalize(a + parseInt(hex.substr(3, 2), 16), 0, 256)
    const b = normalize(a + parseInt(hex.substr(5, 2), 16), 0, 256)
    return `#${(0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1)}`
}

export function darken (hex, percent) {
    return this.brighten(hex, -percent)
}

export function rgbToHex (r, g, b) {
    return ((r < 16) || (g < 8) || b).toString(16)
}

export function overlap (a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

export function isMobileDevice () {
    return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
};

export function normalize (n, min, max) {
    while (n < min) {
        n += (max - min)
    }
    while (n >= max) {
        n -= (max - min)
    }
    return n
}

export function random (min, max) {
    return (min + (Math.random() * (max - min)))
}

export function randomInt (min, max) {
    return Math.round(random(min, max))
}

export function randomChoice (choices) {
    return choices[randomInt(0, choices.length - 1)]
}

export function getEntityByType (entityType) {
    return ENTITIES.filter(({type}) => entityType === type)[0] || null
}

export function getKeyPressed (key) {
    return Object.keys(INPUT_KEYS).find((input) => INPUT_KEYS[input].indexOf(key) !== -1)
}

export function getMiniTile (id, x, y) {
    const tile = MINI_TILES[`${id}`] || null
    if (tile) {
        tile.x = tile.offsetX + x
        tile.y = tile.offsetY + y
    }
    return tile
}

export function isMiniTile (id) {
    return Object.keys(MINI_TILES).indexOf(`${id}`) !== -1
}

export function canJumpThrough (id) {
    return JUMP_THROUGH_TILES.indexOf(id) !== -1
}

export function getProperties (data) {
    if (data && data.length) {
        const properties = {}
        data.map(({name, value}) => {
            properties[name] = value
        })
        return properties
    }
}

export function getElementProperties (element) {
    const { force, properties } = element
    const filteredElement = { force, properties }
    Object.getOwnPropertyNames(element).filter((prop) =>
        typeof element[prop] !== 'object' &&
        typeof element[prop] !== 'function' &&
        prop !== 'properties'
    ).map((prop) => {
        filteredElement[prop] = element[prop]
    })
    return filteredElement
}

// export function gameElementsOrdered (objects) {
//     const byType = (a, b) => {
//         if (
//             a.type === ENTITIES_TYPE.ROCK ||
//             a.type === ENTITIES_TYPE.SWITCH ||
//             a.type === ENTITIES_TYPE.TRIGGER
//         ) return 1
//         if (a.type === ENTITIES_TYPE.ITEM) return -1
//         if (a.type < b.type) return -1
//         if (a.type > b.type) return 1
//         return 0
//     }
//     return objects.sort(byType)// .filter(({type}) => type !== ENTITIES_TYPE.PLAYER)
// }

// export function clearInRange (objects, rect) {
//     objects.map((obj) => {
//         if (
//             overlap(obj, rect) && !obj.dead &&
//             obj.type !== ENTITIES_TYPE.PLAYER &&
//             obj.type !== ENTITIES_TYPE.BALLOON &&
//             obj.type !== ENTITIES_TYPE.DARK_MASK &&
//             obj.type !== ENTITIES_TYPE.TRIGGER &&
//             obj.type !== ENTITIES_TYPE.WATER &&
//             obj.type !== ENTITIES_TYPE.ITEM
//         ) {
//             obj.kill()
//         }
//     })
// }
/**
 * illuminated.js
 */
const { Lamp, Vec2, RectangleObject } = window.illuminated

export function createRectangleObject (x, y, width, height) {
    return new RectangleObject({
        topleft: new Vec2(x, y),
        bottomright: new Vec2(x + width, y + height)
    })
}

export function createLamp (x, y, distance, color) {
    return new Lamp({
        color,
        distance,
        samples: 1,
        radius: 8,
        position: new Vec2(x, y)
    })
}

export function setLightmaskElement (element, {x, y, width, height}) {
    if (element) {
        element.topleft = Object.assign(element.topleft, {x, y})
        element.bottomright = Object.assign(element.bottomright, {x: x + width, y: y + height})
        element.syncFromTopleftBottomright()
        return element
    }
}
