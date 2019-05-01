import { CellState, HintType, LineDirection, LineHint, PicrossShape } from "../PicrossShape";
import { PicrossSolver, LineState } from "../Solver/PicrossSolver";
import EventEmitter, { EventHandler } from "../Utils/EventEmitter";
import { PuzzleJSON, isPuzzleJSON } from "./Puzzles";

export type PuzzleHints = LineHint[][][];

export class PicrossPuzzle extends EventEmitter {

    private hints: PuzzleHints;
    private _shape: PicrossShape;
    private _dims: number[];
    private _name = 'Untitled Puzzle';

    constructor(shape: PicrossShape);
    constructor(dims: number[], hints: PuzzleHints);
    constructor(
        dims_or_shape: number[] | PicrossShape,
        hints_or_name?: PuzzleHints | string
    ) {
        super();
        if (arguments.length === 2) {
            this._dims = dims_or_shape as number[];
            this.hints = hints_or_name as PuzzleHints;
            this._shape = new PicrossShape(this._dims, CellState.unknown);
        } else {
            this._shape = dims_or_shape as PicrossShape;
            this.hints = this._shape.getHints();
            this._dims = this._shape.dims;
            this._shape = new PicrossShape(this._dims, CellState.unknown);
        }
    }

    // a puzzle is satisfied when all hints are satisfied
    public checkResolved(): void {

        const coord_x = [1, 0, 0]; //j, i, i
        const coord_y = [2, 2, 1]; //k, k, j

        for (let d: LineDirection = 0; d < 3; d++) {
            for (let x = 0; x < this._shape.dims[coord_x[d]]; x++) {
                for (let y = 0; y < this._shape.dims[coord_y[d]]; y++) {
                    const hint = this.getLineHint(x, y, d);
                    if (
                        hint !== null &&
                        !PicrossPuzzle.lineSatifiesHint(this._shape.getLine(x, y, d), hint)
                    ) {
                        return;
                    }
                }
            }
        }

        this.emit('resolved');
    }

    public static lineSatifiesHint(line: LineState, hint: LineHint): boolean {
        let cells_count = 0;
        let blocks_count = 0;
        let in_block = false;

        for (const cell of line) {
            if (cells_count > hint.num) {
                return false;
            }

            if (cell !== CellState.blank) {
                if (!in_block) {
                    blocks_count++;
                    in_block = true;
                }
                cells_count++;
            } else if (in_block) {
                in_block = false;
            }
        }

        if (cells_count !== hint.num) {
            return false;
        } else if (hint.num === 0 && cells_count === 0) {
            return true;
        }

        switch (hint.type) {
            case HintType.contiguous:
                return blocks_count === 1;

            case HintType.circle:
                return blocks_count === 2;

            case HintType.rectangle:
                return blocks_count > 2;

            default:
                return false;
        }

    }

    public getRow(j: number, k: number): LineState {
        return this._shape.getRow(j, k);
    }

    public getCol(i: number, k: number): LineState {
        return this._shape.getCol(i, k);
    }

    public getDepth(i: number, j: number): LineState {
        return this._shape.getDepth(i, j);
    }

    public onResolved(handler: EventHandler): void {
        this.on('resolved', handler);
    }

    public getLineHint(x: number, y: number, d: LineDirection): LineHint {
        if (this.hints[d].length - 1 < x) {
            return null;
        }

        return this.hints[d][x][y];
    }

    public hasHint(x: number, y: number, d: LineDirection): boolean {
        if (this.hints[d].length - 1 < x) {
            return false;
        }

        return this.hints[d][x][y] !== null;
    }

    public getDimensions(): number[] {
        return this._shape.dims;
    }

    public getHints(): PuzzleHints {
        return this.hints;
    }

    public get shape(): PicrossShape {
        return this._shape;
    }

    public set shape(new_shape: PicrossShape) {
        this._shape = new_shape;
    }

    public isSolvable(): boolean {
        return PicrossSolver.solve(this) !== null;
    }

    public static cellCountToHint(seq: number[]): LineHint {

        if (seq === undefined || seq.length === 0) return { num: 0, type: HintType.contiguous };

        const sum = seq.reduce((a, c) => a + c);
        const group_count = seq.length;

        if (group_count === 1) return { num: sum, type: HintType.contiguous };
        if (group_count === 2) return { num: sum, type: HintType.circle };
        if (group_count >= 3) return { num: sum, type: HintType.rectangle };
    }

    public toJSON(): PuzzleJSON {
        return {
            dims: this.getDimensions(),
            hints: this.hints,
            name: this._name
        };
    }

    public static fromJSON(puzzle: string): PicrossPuzzle;
    public static fromJSON(puzzle: PuzzleJSON): PicrossPuzzle;
    public static fromJSON(puzzle: PuzzleJSON | string): PicrossPuzzle {
        if (typeof puzzle === 'string') {
            puzzle = JSON.parse(puzzle) as PuzzleJSON;
            if (!isPuzzleJSON(puzzle)) {
                throw new Error(`Incorrect json puzzle`);
            }
        }

        const pzl = new PicrossPuzzle(puzzle.dims, puzzle.hints);
        pzl.name = puzzle.name;
        return pzl;
    }

    public restart(): void {
        this._shape.restore();
    }

    public get dims(): number[] {
        return this._dims;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }
}