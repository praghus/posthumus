import { Layer } from 'platfuse';
import { LAYERS } from '../constants';
export default class Overlay extends Layer {
    id: LAYERS;
    darkOverlay: number;
    fadeSpeed: number;
    fadeTo: number;
    update(): void;
    draw(): void;
    fadeIn(): void;
    fadeOut(): void;
}
