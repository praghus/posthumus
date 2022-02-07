import { Game, Layer } from 'platfuse';
import { LAYERS } from '../constants';
export default class Overlay extends Layer {
    id: LAYERS;
    darkOverlay: number;
    fadeSpeed: number;
    fadeTo: number;
    update(game: Game): void;
    draw(game: Game): void;
    fadeIn(): void;
    fadeOut(): void;
}
