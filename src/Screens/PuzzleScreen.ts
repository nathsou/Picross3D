import { WebGLRenderer } from "three";
import { PuzzleController } from "../Puzzle/PuzzleController";
import { PuzzleRenderer } from "../Puzzle/PuzzleRenderer";
import { Screen, ScreenData } from "./Screen";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";

export interface PuzzleScreenData extends ScreenData {
    puzzle: PicrossPuzzle,
    from_hint_editor: boolean
}

export class PuzzleScreen extends Screen {

    private puzzle_controller: PuzzleController;

    constructor(three_renderer: WebGLRenderer, params: PuzzleScreenData) {
        super(three_renderer, params);

        const renderer = new PuzzleRenderer(params.puzzle, this.three_renderer);
        this.puzzle_controller = new PuzzleController(params.puzzle, renderer, params.from_hint_editor);
    }

    public startRenderLoop(): void {
        this.puzzle_controller.start();
    }

    public dispose(): void {
        this.puzzle_controller.dispose();
    }

}