import { Layer } from 'platfuse';
import { LAYERS } from '../constants';
export default class Background extends Layer {
    id: LAYERS;
    scroll: number;
    draw(): void;
}
