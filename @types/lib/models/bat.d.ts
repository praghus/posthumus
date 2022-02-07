import { Entity, Game } from 'platfuse';
import { DIRECTIONS, LAYERS, ENTITY_FAMILY } from '../constants';
declare enum STATES {
    IDLE = 0,
    FLYING = 1,
    HURT = 2,
    FALL = 3
}
export default class Bat extends Entity {
    image: string;
    family: ENTITY_FAMILY;
    layerId: LAYERS;
    collisionLayers: LAYERS[];
    direction: DIRECTIONS;
    activated: boolean;
    collisions: boolean;
    damage: number;
    energy: number[];
    state: STATES;
    update(game: Game): void;
    hit(damage: number): void;
    collide(obj: Entity, game: Game): void;
    turnAround(): void;
}
export {};
