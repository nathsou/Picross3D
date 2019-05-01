import { BoxBufferGeometry, BoxHelper, Mesh, MeshBasicMaterial, Object3D } from "three";
import { CellMeshSet } from "./CellMeshSet";
import { PicrossActions } from "./PicrossController";
import { PuzzleRenderer } from "./Puzzle/PuzzleRenderer";
import { boundingBox, Box } from "./Utils/Utils";

export class CellSelection {

    private cells: CellMeshSet;
    private selection_start_cell: number[] = null;
    private hovered_cell: number[] = null;
    private selection: Mesh;
    private selection_outline: BoxHelper;

    constructor(cells: CellMeshSet) {

        this.cells = cells;

        this.selection = new Mesh(
            new BoxBufferGeometry(1, 1, 1),
            new MeshBasicMaterial({
                wireframe: false,
                transparent: true,
                opacity: 0.6,
                visible: false
            })
        );

        this.selection_outline = new BoxHelper(this.selection, PuzzleRenderer.options.selection_helper_color);
    }

    public onMouseDown(): void {
        this.selection_start_cell = this.hovered_cell;
    }

    public onMouseUp(actions: PicrossActions): void {
        if (this.selection_start_cell !== null && this.hovered_cell !== null) {

            const box = boundingBox(this.selection_start_cell, this.hovered_cell);

            this.applySelection(box, actions);
            this.selection_start_cell = null;
        }
    }

    public setHoveredCell(coords: number[]): void {
        this.hovered_cell = coords;
    }

    public handleSelection(mouse_down: boolean, actions: PicrossActions): void {

        if (
            mouse_down &&
            (actions.brush.selected || actions.hammer.selected || actions.builder.selected) &&
            this.selection_start_cell !== null &&
            this.hovered_cell !== null
        ) {

            const box = boundingBox(this.selection_start_cell, this.hovered_cell);

            this.setSelection(box, actions);
        } else if (this.hovered_cell !== null) {
            this.setSelection({
                start: this.hovered_cell,
                dims: [1, 1, 1]
            }, actions);
        } else {
            this.hideSelection();
        }

    }

    public setSelection(box: Box, actions: PicrossActions): void {

        // add a small constant to prevent z-fighting
        this.selection.scale.set(
            box.dims[0] + 0.01,
            box.dims[1] + 0.01,
            box.dims[2] + 0.01
        );

        this.selection.position.set(
            box.start[0] + box.dims[0] / 2,
            box.start[1] + box.dims[1] / 2,
            box.start[2] + box.dims[2] / 2
        );

        const color = actions.builder.selected ? PuzzleRenderer.options.build_color :
            (actions.hammer.selected ? PuzzleRenderer.options.erase_color :
                PuzzleRenderer.options.paint_color);

        (this.selection.material as MeshBasicMaterial).color = color;

        (this.selection.material as MeshBasicMaterial).visible = true;
        (this.selection_outline.material as MeshBasicMaterial).visible = true;
        this.selection_outline.update();
    }

    public hideSelection(): void {
        (this.selection.material as MeshBasicMaterial).visible = false;
        (this.selection_outline.material as MeshBasicMaterial).visible = false;
    }

    public applySelection(box: Box, actions: PicrossActions): void {

        for (let i = box.start[0]; i < box.start[0] + box.dims[0]; i++) {
            for (let j = box.start[1]; j < box.start[1] + box.dims[1]; j++) {
                for (let k = box.start[2]; k < box.start[2] + box.dims[2]; k++) {
                    if (actions.brush.selected) { // brush
                        this.cells.paintCell(i, j, k);
                    } else if (actions.hammer.selected) { // hammer
                        this.cells.eraseCell(i, j, k);
                    } else if (actions.builder.selected) { // builder
                        this.cells.placeCell(i, j, k);
                    }
                }
            }
        }

        this.hideSelection();
    }

    public getObjects(): Object3D[] {
        return [
            this.selection,
            this.selection_outline
        ];
    }
}