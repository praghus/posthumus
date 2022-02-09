import { Entity, Game } from 'platfuse';
import { DIRECTIONS, ENTITY_TYPES, LAYERS } from '../constants';
import { StringTMap } from '../types';
export default class Bullet extends Entity {
    image: string;
    animations: {
        DUST: {
            strip: {
                x: number;
                y: number;
                frames: number;
                duration: number;
            };
            width: number;
            height: number;
            loop: boolean;
        };
    };
    direction: DIRECTIONS;
    type: ENTITY_TYPES;
    layerId: LAYERS;
    particle: {
        type: ENTITY_TYPES;
        layerId: LAYERS;
        width: number;
        height: number;
        mass: number;
        count: number;
        radius: number;
        color: string;
        ttl: () => number;
        forceVector: () => {
            x: number;
            y: number;
        };
    };
    collisionLayers: LAYERS[];
    collisions: boolean;
    width: number;
    height: number;
    damage: number;
    constructor(obj: StringTMap<any>, game: Game);
    collide(obj: Entity): void;
    explode(): void;
    update(): void;
}
