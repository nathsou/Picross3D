import { PicrossController } from "../PicrossController";
import { CellState, PicrossShape } from "../PicrossShape";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PicrossSolver } from "../Solver/PicrossSolver";
import { ModelVoxelizer } from "./ModelVoxelizer";
import { PuzzleEditorRenderer } from "./PuzzleEditorRenderer";

export class PuzzleEditorController extends PicrossController {

    protected renderer: PuzzleEditorRenderer;
    private file_selector: HTMLInputElement;

    constructor(renderer: PuzzleEditorRenderer, shape: PicrossShape) {
        super(renderer, shape, false, true);
        this.orbit_controls.target.y = 0;
        this.cells.setPlacedCellsState(CellState.painted);
        this.handleFileSelection();
    }

    public selectFile(): void {
        this.file_selector.click();
    }

    private handleFileSelection(): void {
        this.file_selector = document.createElement('input');
        this.file_selector.type = 'file';
        this.file_selector.accept = '.obj,.json';

        this.file_selector.addEventListener('change', async () => {
            const model = this.file_selector.files[0];
            if (model !== undefined) {
                const uri = window.URL.createObjectURL(model);
                if (model.type === 'application/json') {
                    await this.loadJsonPuzzle(uri);
                } else {
                    await this.loadModel(uri);
                }

                this.renderer.needsReRender();
            }
        });
    }

    private async loadJsonPuzzle(uri: string) {
        const data = await (await fetch(uri)).text();

        try {
            const puzzle = PicrossPuzzle.fromJSON(data);
            const shape = PicrossSolver.hierarchicalSolve(puzzle);
            if (shape === null) {
                throw new Error('Puzzle is not linesolvable')
            }
            const offset = [0, 2].map(d => Math.floor((this.shape.dims[d] - shape.dims[d]) / 2));

            for (let i = 0; i < shape.dims[0]; i++) {
                for (let j = 0; j < shape.dims[1]; j++) {
                    for (let k = 0; k < shape.dims[2]; k++) {
                        this.shape.setCell(i + offset[0], j, k + offset[1], shape.getCell(i, j, k));
                    }
                }
            }

            this.cells.updateAllCells();
        } catch (e) {
            throw e;
        }
    }

    private async loadModel(uri: string) {
        await ModelVoxelizer.load(uri, this.shape);
        this.cells.updateAllCells();
    }

    public reset(): void {
        this.shape.reset();
        this.cells.clear();
        this.cells.update();
        this.renderer.needsReRender();
    }

    // raycast against the floor
    protected rayCast(): number[] {

        if (!this.needs_recast) return null;

        if (!super.rayCast()) {
            this.needs_recast = false;
            const coords = this.renderer.rayCast(this.raycaster);
            this.selection.setHoveredCell(coords);
            this.handleSelection();

            return coords;
        }

        this.needs_recast = false;
        return null;
    }

    protected render(): void {
        this.renderer.render();
    }

    public dispose(): void {
        super.dispose();
    }

}