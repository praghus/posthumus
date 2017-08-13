export const SOUND_MAIN_LOOP = 'SOUND_MAIN_LOOP'
export const SOUND_PLAYER_RELOAD = 'SOUND_PLAYER_RELOAD'
export const SOUND_PLAYER_SHOOT = 'SOUND_PLAYER_SHOOT'
export const SOUND_ZOMBIE_GROAN = 'SOUND_ZOMBIE_GROAN'

export function playMusic () {
    return {
        type: SOUND_MAIN_LOOP,
        meta: { sound: SOUND_MAIN_LOOP }
    }
}

export function playerReload () {
    return {
        type: SOUND_PLAYER_RELOAD,
        meta: { sound: SOUND_PLAYER_RELOAD }
    }
}

export function playerShoot () {
    return {
        type: SOUND_PLAYER_SHOOT,
        meta: { sound: SOUND_PLAYER_SHOOT }
    }
}

export function zombieGroan () {
    return {
        type: SOUND_ZOMBIE_GROAN,
        meta: { sound: SOUND_ZOMBIE_GROAN }
    }
}
