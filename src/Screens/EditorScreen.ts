import { Screen, ScreenData } from "./Screen";
import { PuzzleEditorController } from "../Editor/PuzzleEditorController";
import { WebGLRenderer } from "three";
import { PuzzleEditorRenderer } from "../Editor/PuzzleEditorRenderer";
import { PicrossShape, CellState } from "../PicrossShape";

export class EditorScreen extends Screen {

    private editor: PuzzleEditorController;

    constructor(three_renderer: WebGLRenderer, params: ScreenData) {
        super(three_renderer, params);

        const renderer = new PuzzleEditorRenderer(three_renderer);
        const shape = params.shape !== undefined ? params.shape : new PicrossShape(renderer.maxDims, CellState.blank)
        this.editor = new PuzzleEditorController(renderer, shape);
    }

    public startRenderLoop(): void {
        this.editor.start();
    }

    public dispose(): void {
        this.editor.dispose();
    }

}