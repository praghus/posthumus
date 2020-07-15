import { Howl } from 'howler'

const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)
const extractFiles = (state: any, file: any) => file.default && ({ ...state, [file.default.split('-')[0]]: file.default })
const allImages = require.context('../../assets/images', true, /.*\.(png|jpg)/)
const allSounds = require.context('../../assets/sounds', true, /.*\.mp3/)

export const IMG_FILES = requireAll(allImages).reduce(extractFiles, {})
export const SOUND_FILES = requireAll(allSounds).reduce(extractFiles, {})

export enum IMAGES {
    AMMO = 'ammo',
    BACKGROUND = 'background',
    BULLET = 'bullet',
    BAT = 'bat',
    ENERGY = 'energy',
    ENERGY_STRIP = 'energy_strip',
    FONT_SMALL = 'font_small',
    FONT_NORMAL = 'font_small',
    MOON = 'moon',
    CLOUDS = 'clouds',
    DUST = 'dust',
    PLAYER = 'player',
    SHINE = 'shine',
    TORCH = 'torches',
    ZOMBIE = 'zombie'
}

export const SOUNDS = {
    DEAD1: new Howl({src: SOUND_FILES['dead1']}),
    POWERUP: new Howl({src: SOUND_FILES['powerup']}),
    RELOAD: new Howl({src: SOUND_FILES['reload']}),
    SHOOT: new Howl({src: SOUND_FILES['shoot']}),
    ZOMBIE: new Howl({src: SOUND_FILES['zombie']})
}