import { Entity, Game, Vec2 } from 'platfuse';
import { StringTMap } from '../types';
import { ENTITY_TYPES, LAYERS } from '../constants';
export declare const GIDS: {
    AMMO: number;
    COIN: number;
    HEALTH: number;
};
export default class Item extends Entity {
    type: ENTITY_TYPES;
    layerId: LAYERS;
    collisionLayers: LAYERS[];
    collisions: boolean;
    constructor(obj: StringTMap<any>, game: Game);
    collide(obj: Entity): void;
    update(): void;
}
export declare function dropItem(game: Game, pos: Vec2): void;
