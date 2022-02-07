import { Game, Entity } from 'platfuse';
import { ENTITY_FAMILY } from '../constants';
export default class Emitter extends Entity {
    family: ENTITY_FAMILY;
    count: number;
    emitted: number;
    emit: (game: Game) => void;
    update(game: Game): void;
}
