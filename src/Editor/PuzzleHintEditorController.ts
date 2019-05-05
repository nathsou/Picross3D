import { PicrossController } from "../PicrossController";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PuzzleHintEditorRenderer } from "./PuzzleHintEditorRenderer";

export class PuzzleHintEditorController extends PicrossController {

    private puzzle: PicrossPuzzle;

    constructor(puzzle: PicrossPuzzle, renderer: PuzzleHintEditorRenderer) {
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


    protected rayCast(): number[] {

        if (!this.needs_recast) return null;

        if (this.handles_manager) {
            if (this.handles_manager.rayCast(this.mouse, this.renderer.camera)) {
                return null;
            }
        } else {
            this.raycaster.setFromCamera(this.mouse, this.renderer.camera);
        }

        const inter = this.cells.rayCast(this.raycaster, this.actions.builder.selected);

        // this.selection.setHoveredCell(coords);
        // this.handleSelection();

        if (inter.face !== null) {

        }

        this.needs_recast = false;

        return inter.pos;
    }

    public resetHints() {
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