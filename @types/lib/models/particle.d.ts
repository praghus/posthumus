import { Entity, Game, Scene, Vec2 } from 'platfuse';
import { StringTMap } from '../types';
import { ENTITY_FAMILY, ENTITY_TYPES, LAYERS } from '../constants';
export default class Particle extends Entity {
    family: ENTITY_FAMILY;
    collisionLayers: LAYERS[];
    collisions: boolean;
    mass: number;
    life: number;
    constructor(obj: StringTMap<any>);
    update(game: Game): void;
}
export declare function createParticles(scene: Scene, pos: Vec2, config: any): void;
export declare const PARTICLES: {
    BLOOD: {
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
    DIRT: {
        type: ENTITY_TYPES;
        layerId: LAYERS;
        mass: number;
        width: number;
        height: number;
        count: number;
        radius: number;
        color: string;
        ttl: () => number;
        forceVector: () => {
            x: number;
            y: number;
        };
    };
    RUBBLE: {
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
};
