import { Entity, Game, Scene, Vec2 } from 'platfuse';
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
    constructor(obj: StringTMap<any>);
    collide(obj: Entity, game: Game): void;
    update(game: Game): void;
}
export declare function dropItem(scene: Scene, pos: Vec2): void;
