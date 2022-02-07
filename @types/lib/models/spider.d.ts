import { Entity, Game, Vec2 } from 'platfuse';
import { StringTMap } from '../types';
import { ENTITY_FAMILY, LAYERS } from '../constants';
export default class Spider extends Entity {
    image: string;
    family: ENTITY_FAMILY;
    collisionLayers: LAYERS[];
    collisions: boolean;
    fall: boolean;
    rise: boolean;
    startPos: Vec2;
    energy: number[];
    damage: number;
    constructor(obj: StringTMap<any>);
    draw(game: Game): void;
    update(game: Game): void;
    hit(damage: number): void;
    collide(obj: Entity, game: Game): void;
}
