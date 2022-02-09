import { Entity, Game, Vec2 } from 'platfuse';
import { StringTMap } from '../types';
import { LAYERS } from '../constants';
export declare const GIDS: {
    AMMO: number;
    COIN: number;
    HEALTH: number;
};
export default class Item extends Entity {
    layerId: LAYERS;
    collisionLayers: LAYERS[];
    collisions: boolean;
    constructor(obj: StringTMap<any>, game: Game);
    collide(obj: Entity): void;
    update(): void;
}
export declare function dropItem(game: Game, pos: Vec2): void;
