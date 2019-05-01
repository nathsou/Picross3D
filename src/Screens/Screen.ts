import { WebGLRenderer } from "three";

export interface ScreenData {
    [index: string]: any;
}

export interface Disposable {
    dispose(): void;
}

export abstract class Screen implements Disposable {

    protected three_renderer: WebGLRenderer;
    protected data: ScreenData;

    constructor(three_renderer: WebGLRenderer, data: ScreenData) {
        this.three_renderer = three_renderer;
        this.data = data;
    }

    public abstract startRenderLoop(): void;

    public abstract dispose(): void;
}