import { PicrossController } from "../PicrossController";

import { PicrossPuzzle } from "./PicrossPuzzle";
import { PuzzleRenderer } from "./PuzzleRenderer";

export class PuzzleController extends PicrossController {

    private puzzle: PicrossPuzzle;

    constructor(puzzle: PicrossPuzzle, renderer: PuzzleRenderer) {
        super(renderer, puzzle.shape);
        this.puzzle = puzzle;

        this.cells.on('eraseCell', () => {
            this.puzzle.checkResolved();
        });

        this.cells.on('paintCell', () => {
            this.puzzle.checkResolved();
        });

        this.puzzle.on('resolved', () => {
            this.orbit_controls.autoRotate = true;
            this.orbit_controls.autoRotateSpeed = 6;
            if (this.handles_manager !== undefined) {
                this.handles_manager.hideHandles();
            }
            this.renderer.needsReRender();
            // localStorageManager.addResolvedPuzzle(this.puzzle.name);
        });
    }

    public restart(): void {
        this.restore();
        this.puzzle.restart();
    }

    protected render(): void {
        this.renderer.render();
    }

    public dispose(): void {
        super.dispose();
    }

}