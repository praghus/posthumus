import {
    SOUND_PLAYER_RELOAD,
    SOUND_PLAYER_SHOOT,
    SOUND_ZOMBIE_GROAN,
    SOUND_MAIN_LOOP
} from '../../actions/sounds'

export const soundsData = {
    [SOUND_PLAYER_RELOAD]: '../../../assets/sounds/reload.wav',
    [SOUND_PLAYER_SHOOT]: '../../../assets/sounds/shoot.wav',
    [SOUND_ZOMBIE_GROAN]: '../../../assets/sounds/zombie.wav',
    [SOUND_MAIN_LOOP]: {
        urls: ['../../../assets/sounds/loop.mp3'],
        loop: 1
    }
}
