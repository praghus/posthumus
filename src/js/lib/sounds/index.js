import {
    SOUND_ZOMBIE_GROAN,
    SOUND_MAIN_LOOP
} from '../../actions/sounds'

export const soundsData = {
    [SOUND_ZOMBIE_GROAN]: '../../../assets/sounds/zombie.wav',
    [SOUND_MAIN_LOOP]: {
        urls: ['../../../assets/sounds/loop.mp3'],
        loop: 1
    }
}
