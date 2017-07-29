export const SOUND_ZOMBIE_GROAN = 'SOUND_ZOMBIE_GROAN'
export const SOUND_MAIN_LOOP = 'SOUND_MAIN_LOOP'

export function zombieGroan () {
    return {
        type: SOUND_ZOMBIE_GROAN,
        meta: { sound: SOUND_ZOMBIE_GROAN }
    }
}

export function playMusic () {
    return {
        type: SOUND_MAIN_LOOP,
        meta: { sound: SOUND_MAIN_LOOP }
    }
}
