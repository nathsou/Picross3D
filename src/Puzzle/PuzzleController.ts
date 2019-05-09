import { PicrossController } from "../PicrossController";

import { PicrossPuzzle } from "./PicrossPuzzle";
import { PuzzleRenderer } from "./PuzzleRenderer";

export class PuzzleController extends PicrossController {

    private puzzle: PicrossPuzzle;

    constructor(puzzle: PicrossPuzzle, renderer: PuzzleRenderer) {
        super(renderer, puzzle.shape);
        this.puzzle = puzzle;

        this.cells.on('erase_cell', () => {
            this.puzzle.checkResolved();
        });

        this.cells.on('paint_cell', () => {
            this.puzzle.checkResolved();
        });

        this.puzzle.on('resolved', () => {
            this.orbit_controls.autoRotate = true;
            this.orbit_controls.autoRotateSpeed = 6;
            if (this.handles_manager !== undefined) {
                this.showAllCells();
                this.handles_manager.hideHandles();
            }
            this.renderer.needsReRender();
        });
    }

    public restart(): void {
        this.restore();

        if (this.handles_manager !== undefined) {
            this.handles_manager.showHandles();
            this.showAllCells();
        }

        this.orbit_controls.autoRotate = false;
        this.puzzle.restart();
        this.renderer.needsReRender();
    }

    protected render(): void {
        this.renderer.render();
    }

    public dispose(): void {
        super.dispose();
    }

}