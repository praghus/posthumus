import { Scene } from 'platfuse';
import Player from '../models/player';
export default class MainScene extends Scene {
    gravity: number;
    flash: boolean;
    player?: Player;
    init(): Promise<void>;
}
