import { Entity, Game } from 'platfuse';
import { DIRECTIONS, ENTITY_TYPES, LAYERS } from '../constants';
import { StringTMap } from '../types';
export default class Dust extends Entity {
    image: string;
    layerId: LAYERS;
    type: ENTITY_TYPES;
    direction: DIRECTIONS;
    width: number;
    height: number;
    constructor(obj: StringTMap<any>, game: Game);
    update(): void;
}
