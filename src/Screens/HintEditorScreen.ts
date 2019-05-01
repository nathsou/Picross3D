import { WebGLRenderer } from "three";
import { PuzzleHintEditorController } from "../Editor/PuzzleHintEditorController";
import { PuzzleHintEditorRenderer } from "../Editor/PuzzleHintEditorRenderer";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { Screen, ScreenData } from "./Screen";

export interface PuzzleScreenData extends ScreenData {
    puzzle: PicrossPuzzle
}

export class HintEditorScreen extends Screen {

    private puzzle_controller: PuzzleHintEditorController;

    constructor(three_renderer: WebGLRenderer, params: PuzzleScreenData) {
        super(three_renderer, params);

        const renderer = new PuzzleHintEditorRenderer(params.puzzle, this.three_renderer);
        this.puzzle_controller = new PuzzleHintEditorController(params.puzzle, renderer);
    }

    public startRenderLoop(): void {
        this.puzzle_controller.start();
    }

    public dispose(): void {
        this.puzzle_controller.dispose();
    }

}