import { Entity } from 'platfuse';
import { ENTITY_FAMILY } from '../constants';
export default class Emitter extends Entity {
    family: ENTITY_FAMILY;
    count: number;
    emitted: number;
    emit(): void;
    update(): void;
}
