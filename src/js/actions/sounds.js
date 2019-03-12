export const PLAY_SOUND = 'PLAY_SOUND'

export function playSound (sound) {
    return {
        type: PLAY_SOUND,
        meta: {
            sound: {
                play: sound
            }
        }
    }
}
