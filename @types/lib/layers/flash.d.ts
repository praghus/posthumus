import { Game, Layer } from 'platfuse';
import { LAYERS } from '../constants';
export default class Flash extends Layer {
    id: LAYERS;
    draw(game: Game): void;
}