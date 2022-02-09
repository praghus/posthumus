import { Entity } from 'platfuse';
import { ENTITY_FAMILY, LAYERS } from '../constants';
export default class Spikes extends Entity {
    image: string;
    animation: {
        strip: {
            x: number;
            y: number;
            frames: number;
            duration: number;
        };
        width: number;
        height: number;
        loop: boolean;
    };
    family: ENTITY_FAMILY;
    collisionLayers: LAYERS[];
    collisions: boolean;
    canAnimate: boolean;
    damage: number;
    shineX: number;
    draw(): void;
    update(): void;
    collide(obj: Entity): void;
}
