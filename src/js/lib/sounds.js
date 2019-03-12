import { requireAll } from '../lib/helpers'

const allSounds = require.context('../../assets/sounds', true, /.*\.(mp3|wav)$/)
const loadedSounds = requireAll(allSounds).reduce(
    (state, sound) => ({...state, [sound.split('-')[0]]: sound}), {}
)

export const SOUNDS = {
    PLAYER_JUMP: 'jump',
    PLAYER_GET: 'get',
    MAIN_LOOP: 'loop',
    PLAYER_RELOAD: 'reload',
    PLAYER_SHOOT: 'shoot',
    ZOMBIE_GROAN: 'zombie'
}

export const soundsData = {
    [SOUNDS.PLAYER_RELOAD]: {src: [loadedSounds[SOUNDS.PLAYER_RELOAD]]},
    [SOUNDS.PLAYER_SHOOT]: {src: [loadedSounds[SOUNDS.PLAYER_SHOOT]]}
}

