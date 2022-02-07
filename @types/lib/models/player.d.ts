import { Game, Entity, Scene } from 'platfuse';
import { DIRECTIONS, LAYERS } from '../constants';
export default class Player extends Entity {
    image: string;
    collisionLayers: LAYERS[];
    facing: DIRECTIONS;
    energy: number[];
    ammo: number[];
    points: number;
    collisions: boolean;
    invincible: boolean;
    isJumping: boolean;
    isShooting: boolean;
    isReloading: boolean;
    isHurt: boolean;
    update(game: Game): void;
    move(game: Game, direction: DIRECTIONS): void;
    shoot(game: Game): void;
    reloading: (game: Game) => void;
    countToReload: (game: Game) => void;
    cancelReloading(game: Game): void;
    bullet(scene: Scene): void;
    dust(game: Game, direction: string): void;
    cameraFollow(game: Game): void;
    respawn: (game: Game) => void;
    hit(damage: number, game: Game): void;
}
