import { Entity } from 'platfuse';
import { DIRECTIONS, LAYERS, ENTITY_FAMILY } from '../constants';
declare enum STATES {
    IDLE = 0,
    FLYING = 1,
    FALL = 2
}
export default class Bat extends Entity {
    image: string;
    family: ENTITY_FAMILY;
    layerId: LAYERS;
    collisionLayers: LAYERS[];
    direction: DIRECTIONS;
    activated: boolean;
    collisions: boolean;
    turning: boolean;
    damage: number;
    energy: number[];
    state: STATES;
    update(): void;
    hit(damage: number): void;
    collide(obj: Entity): void;
    turnAround(): void;
}
export {};
