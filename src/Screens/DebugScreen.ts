import { WebGLRenderer } from "three";
import { Debug } from "../Editor/Debug";
import { Screen, ScreenData } from "./Screen";


export class DebugScreen extends Screen {

    private debug: Debug;

    constructor(three_renderer: WebGLRenderer, params: ScreenData) {
        super(three_renderer, params);

        this.debug = new Debug(three_renderer);
    }

    public startRenderLoop(): void {
        this.debug.start();
    }

    public dispose(): void {
        // this.debug.dispose();
    }

}