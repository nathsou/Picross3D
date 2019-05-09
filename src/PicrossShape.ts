import { PicrossPuzzle, PuzzleHints } from "./Puzzle/PicrossPuzzle";
import { LineInfo, LineState } from "./Solver/PicrossSolver";
import { coord_x, coord_y } from "./Solver/PuzzleGenerator";
import { Array3D, IterableWritableArrayLike } from "./Utils/Array3D";
import { boundingBox, Box } from "./Utils/Utils";


export type CellCounts = number[][][];
export type PuzzleDescription = CellCounts[];

export interface ShapeJSON {
    dims: number[],
    cells: IterableWritableArrayLike<CellState>
}

export enum LineDirection {
    row, col, depth
}

export enum CellState {
    blank, unknown, painted
}

export enum HintType {
    simple, circle, square
}

export interface LineHint {
    num: number,
    type: HintType
}

export interface ShapeEdit {
    from: CellState,
    to: CellState,
    coords: number[]
}

export interface ShapeEditHistory {
    history: ShapeEdit[],
    dims: number[]
}

export class PicrossShape {

    private cells: Array3D<CellState>;
    private edits_history: ShapeEdit[];
    private hints: PuzzleHints;
    private needs_new_hints = true;

    constructor(cells: ArrayLike<CellState> | Uint8Array, bounds: number[]);
    constructor(dims: number[], fill_with: CellState);
    constructor(dims_or_cells: number[] | Uint8Array | CellState[], bounds_or_state: number[] | CellState) {

        if (Array.isArray(bounds_or_state)) {
            this.cells = new Array3D(
                dims_or_cells instanceof Uint8Array ? dims_or_cells :
                    new Uint8Array(dims_or_cells),
                bounds_or_state
            );

        } else {
            const data = new Uint8Array(dims_or_cells[0] * dims_or_cells[1] * dims_or_cells[2]);
            data.fill(bounds_or_state);
            this.cells = new Array3D(data, dims_or_cells as number[]);
        }

        this.edits_history = [];
    }

    public trim(): void {
        const bounding_box = this.computeBoundingBox();
        this.cells.slice(bounding_box.start, bounding_box.start.map((p, i) => p + bounding_box.dims[i]));
    }

    private computeBoundingBox(): Box {

        const min = [this.cells.dims[0], this.cells.dims[1], this.cells.dims[2]];
        const max = [0, 0, 0];
        const coords = [];

        for (let d = 0; d < 3; d++) {
            for (coords[coord_x[d]] = 0; coords[coord_x[d]] < this.cells.dims[coord_x[d]]; coords[coord_x[d]]++) {
                for (coords[coord_y[d]] = 0; coords[coord_y[d]] < this.cells.dims[coord_y[d]]; coords[coord_y[d]]++) {
                    for (coords[d] = 0; coords[d] < min[d]; coords[d]++) {
                        if (this.cells.at(coords[0], coords[1], coords[2]) !== CellState.blank) {
                            min[d] = coords[d];
                            break;
                        }
                    }

                    for (coords[d] = this.cells.dims[d] - 1; coords[d] >= max[d]; coords[d]--) {
                        if (this.cells.at(coords[0], coords[1], coords[2]) !== CellState.blank) {
                            max[d] = coords[d];
                            break;
                        }
                    }
                }
            }
        }

        return boundingBox(min, max);
    }

    // returns whether the state has changed
    public setCell(i: number, j: number, k: number, state: CellState): boolean {
        if (i < 0 || i >= this.dims[0] ||
            j < 0 || j >= this.dims[1] ||
            k < 0 || k >= this.dims[2]
        ) {
            return false;
        }

        const prev = this.cells.at(i, j, k);
        const changed = prev !== state;

        if (changed) {
            this.edits_history.push({ from: prev, to: state, coords: [i, j, k] });
            this.cells.set(i, j, k, state);
        }

        return changed;
    }

    public getCell(i: number, j: number, k: number): CellState {
        if (i < 0 || i >= this.dims[0] ||
            j < 0 || j >= this.dims[1] ||
            k < 0 || k >= this.dims[2]
        ) {
            return CellState.blank;
        }

        return this.cells.at(i, j, k);
    }

    public cellExists(i: number, j: number, k: number): boolean {
        const c = this.getCell(i, j, k);
        return c !== undefined && c !== CellState.blank;
    }

    public getCells(): Array3D<number> {
        return this.cells;
    }

    public get dims(): number[] {
        return this.cells.dims;
    }


    public getRowCellCounts(): CellCounts {

        let row_counts: number[][][] = [];
        let blank = false;

        for (let k = 0; k < this.dims[2]; k++) {
            for (let j = 0; j < this.dims[1]; j++) {
                if (k === 0) row_counts[j] = [];
                //ith row
                let row_rep: number[] = [];
                for (let i = 0; i < this.dims[0]; i++) {
                    if (this.cellExists(i, j, k)) {
                        if (row_rep.length === 0 || blank) {
                            row_rep.push(1);
                            blank = false;
                        } else {
                            row_rep[row_rep.length - 1]++;
                        }
                    } else {
                        // there's at least one blank between two groups
                        blank = true;
                    }
                }
                row_counts[j][k] = row_rep;
            }
        }

        return row_counts;
    }

    public getColCellCounts(): CellCounts {

        let col_counts: number[][][] = [];
        let blank = false;

        for (let k = 0; k < this.dims[2]; k++) {
            for (let i = 0; i < this.dims[0]; i++) {
                if (k === 0) col_counts[i] = [];
                //jth column
                let col_rep: number[] = [];
                for (let j = 0; j < this.dims[1]; j++) {
                    if (this.cellExists(i, j, k)) {
                        if (col_rep.length === 0 || blank) {
                            col_rep.push(1);
                            blank = false;
                        } else {
                            col_rep[col_rep.length - 1]++;
                        }
                    } else {
                        blank = true; //there's at least one blank between two groups
                    }
                }
                col_counts[i][k] = col_rep;
            }
        }

        return col_counts;
    }

    public getDepthCellCounts(): CellCounts {

        const depth_counts: number[][][] = [];
        let blank = false;

        for (let j = 0; j < this.dims[1]; j++) {
            for (let i = 0; i < this.dims[0]; i++) {
                if (j === 0) depth_counts[i] = [];

                let depth_rep: number[] = [];
                for (let k = 0; k < this.dims[2]; k++) {
                    if (this.cellExists(i, j, k)) {
                        if (depth_rep.length === 0 || blank) {
                            depth_rep.push(1);
                            blank = false;
                        } else {
                            depth_rep[depth_rep.length - 1]++;
                        }
                    } else {
                        blank = true; //there's at least one blank between two groups
                    }
                }
                depth_counts[i][j] = depth_rep;
            }
        }

        return depth_counts;
    }

    public getDescription(): PuzzleDescription {

        return [
            this.getRowCellCounts(),
            this.getColCellCounts(),
            this.getDepthCellCounts()
        ];
    }

    public getHints(): PuzzleHints {
        if (!this.needs_new_hints) {
            return this.hints;
        }

        const desc = this.getDescription();
        this.hints = [];

        for (let d: LineDirection = 0; d < 3; d++) {
            this.hints.push([]);
            for (let x = 0; x < this.dims[coord_x[d]]; x++) {
                const line: LineHint[] = [];
                for (let y = 0; y < this.dims[coord_y[d]]; y++) {
                    line.push(PicrossPuzzle.cellCountToHint(desc[d][x][y]));
                }
                this.hints[d].push(line);
            }
        }

        this.needs_new_hints = false;

        return this.hints;
    }

    public getRow(j: number, k: number): LineState {
        const row = [];

        for (let i = 0; i < this.dims[0]; i++) {
            row.push(this.getCell(i, j, k));
        }

        return row;
    }

    public getCol(i: number, k: number): LineState {
        const col = [];

        for (let j = 0; j < this.dims[1]; j++) {
            col.push(this.getCell(i, j, k));
        }

        return col;
    }

    public getDepth(i: number, j: number): LineState {
        const depth = [];

        for (let k = 0; k < this.dims[2]; k++) {
            depth.push(this.getCell(i, j, k));
        }

        return depth;
    }

    public getLine(x: number, y: number, dir: LineDirection): LineState {

        switch (dir) {
            case LineDirection.row:
                return this.getRow(x, y);
            case LineDirection.col:
                return this.getCol(x, y);
            case LineDirection.depth:
                return this.getDepth(x, y);
        }

        return null;
    }

    // returns whether the state of the line changes
    public setRow(j: number, k: number, info: LineInfo): boolean {

        if (info === null) {
            return false;
        }

        let changed = false;

        for (const block of info.blocks) {
            for (let i = block.start; i < block.start + block.len; i++) {
                changed = this.setCell(i, j, k, CellState.painted) || changed;
            }
        }

        for (const blank of info.blanks) {
            for (let i = blank.start; i < blank.start + blank.len; i++) {
                changed = this.setCell(i, j, k, CellState.blank) || changed;
            }
        }

        this.needs_new_hints = changed;

        return changed;
    }

    public setCol(i: number, k: number, info: LineInfo): boolean {

        let changed = false;

        if (info === null) {
            return;
        }

        for (const block of info.blocks) {
            for (let j = block.start; j < block.start + block.len; j++) {
                changed = this.setCell(i, j, k, CellState.painted) || changed;
            }
        }

        for (const blank of info.blanks) {
            for (let j = blank.start; j < blank.start + blank.len; j++) {
                changed = this.setCell(i, j, k, CellState.blank) || changed;
            }
        }

        this.needs_new_hints = changed;

        return changed;
    }

    public setDepth(i: number, j: number, info: LineInfo): boolean {

        let changed = false;

        if (info === null) {
            return;
        }

        for (const block of info.blocks) {
            for (let k = block.start; k < block.start + block.len; k++) {
                changed = this.setCell(i, j, k, CellState.painted) || changed;
            }
        }

        for (const blank of info.blanks) {
            for (let k = blank.start; k < blank.start + blank.len; k++) {
                changed = this.setCell(i, j, k, CellState.blank) || changed;
            }
        }

        this.needs_new_hints = changed;

        return changed;
    }

    public setLine(x: number, y: number, dir: LineDirection, info: LineInfo): boolean {

        switch (dir) {
            case LineDirection.row:
                return this.setRow(x, y, info);
            case LineDirection.col:
                return this.setCol(x, y, info);
            case LineDirection.depth:
                return this.setDepth(x, y, info);
        }

        return null;
    }


    // returns the list of cells surrounded by a blank in the line
    public getLineEdges(x: number, y: number, d: LineDirection): number[] {
        const line = this.getLine(x, y, d);

        // first and last cells are edges
        const edges = [0, line.length - 1];

        for (let i = 1; i < line.length - 1; i++) {
            if (line[i] !== CellState.blank && (
                line[i - 1] === CellState.blank ||
                line[i + 1] === CellState.blank
            )) {
                edges.push(i);
            }
        }

        return edges;
    }

    public getLineHint(x: number, y: number, d: LineDirection): LineHint {
        if (this.getHints()[d].length - 1 < x) {
            return null;
        }

        return this.getHints()[d][x][y];
    }

    // static methods

    public static generate(
        dims: number[],
        generator: (i: number, j: number, k: number) => number | boolean)
        : PicrossShape {

        const cells = [];

        for (let k = 0; k < dims[2]; k++) {
            for (let j = 0; j < dims[1]; j++) {
                for (let i = 0; i < dims[0]; i++) {
                    const val = generator(i, j, k);
                    cells.push(typeof val === 'boolean' ? Number(val) : val);
                }
            }
        }
        return new PicrossShape(cells, dims);
    }

    public get editHistory(): ShapeEditHistory {
        return {
            history: this.edits_history,
            dims: this.dims
        };
    }

    public restore(): void {
        for (const { from, coords } of this.edits_history) {
            this.cells.set(coords[0], coords[1], coords[2], from)
        }

        this.edits_history = [];
    }

    public reset(): void {
        for (const { coords } of this.edits_history) {
            this.cells.set(coords[0], coords[1], coords[2], CellState.blank);
        }

        this.edits_history = [];
    }

    public static fromHistory(hist: ShapeEditHistory): PicrossShape {
        const shape = new PicrossShape(hist.dims, CellState.blank);
        shape.edits_history = hist.history;
        shape.restore();

        return shape;
    }

    public toJSON(): ShapeJSON {
        return {
            dims: [...this.dims],
            cells: [...this.cells.data]
        };
    }

    public static fromJSON(shape: ShapeJSON): PicrossShape {
        return new PicrossShape(shape.cells, shape.dims);
    }

    public fillBoundingBox(): void {
        const box = this.computeBoundingBox();

        for (let i = box.start[0]; i < box.start[0] + box.dims[0]; i++) {
            for (let j = box.start[1]; j < box.start[1] + box.dims[1]; j++) {
                for (let k = box.start[2]; k < box.start[2] + box.dims[2]; k++) {
                    if (!this.cellExists(i, j, k)) {
                        this.setCell(i, j, k, CellState.unknown);
                    }
                }
            }
        }
    }
}