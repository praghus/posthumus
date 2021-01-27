/// <reference types="tmx-tiledmap" />
declare namespace Posthumous {
    export interface StringTMap<T> {
        [key: string]: T;
    }

    export interface Asset {
        src: string;
        width: number;
        height: number;
    }
}

declare module '*.tmx' {
    const value: any
    export default value
}

declare module 'posthumous' {
	export = Posthumous;
}
