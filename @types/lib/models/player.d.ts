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
    update(): void;
    move(direction: DIRECTIONS): void;
    shoot(): void;
    reloading: () => void;
    countToReload: () => void;
    cancelReloading: () => void;
    bullet(scene: Scene): void;
    dust(direction: string): void;
    cameraFollow(): void;
    respawn: (game: Game) => void;
    hit(damage: number): void;
}
