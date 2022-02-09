import { Entity, Game } from 'platfuse';
import { StringTMap } from '../types';
import { DIRECTIONS, ENTITY_FAMILY, ENTITY_TYPES, LAYERS } from '../constants';
declare enum STATES {
    RISE = 0,
    IDLE = 1,
    WALK = 2,
    RUN = 3,
    ATTACK = 4,
    HURT = 5,
    DEFEAT = 6
}
export default class Zombie extends Entity {
    image: string;
    state: STATES;
    family: ENTITY_FAMILY;
    type: ENTITY_TYPES;
    layerId: LAYERS;
    collisionLayers: LAYERS[];
    collisions: boolean;
    direction: DIRECTIONS;
    pid: string;
    damage: number;
    energy: number[];
    speed: {
        a: number;
        d: number;
        m: number;
    };
    activated: boolean;
    turning: boolean;
    constructor(obj: StringTMap<any>, game: Game);
    update(): void;
    hit(damage: number): void;
    collide(obj: Entity): void;
    isFacingPlayer(player: Entity): boolean;
    turnAround(): void;
}
export {};
