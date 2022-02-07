import { Game, Scene } from 'platfuse';
import * as Models from '../models';
export default class MainScene extends Scene {
    gravity: number;
    flash: boolean;
    player?: Models.Player;
    entities: {
        bat: typeof Models.Bat;
        bullet: typeof Models.Bullet;
        dust: typeof Models.Dust;
        emitter: typeof Models.Emitter;
        item: typeof Models.Item;
        particle: typeof Models.Particle;
        player: typeof Models.Player;
        spider: typeof Models.Spider;
        spikes: typeof Models.Spikes;
        zombie: typeof Models.Zombie;
    };
    init(game: Game): Promise<void>;
}
