import { LineDirection, LineHint } from "../PicrossShape";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PicrossSolver } from "./PicrossSolver";

export const coord_x = [1, 0, 0]; //j, i, i
export const coord_y = [2, 2, 1]; //k, k, j

export type LineCoords = { x: number, y: number, d: LineDirection };
export type IndexedLineCoords = { x: number, y: number, d: LineDirection, idx: number };
export type InfoLineCoords = { x: number, y: number, d: LineDirection, idx: number, hint: LineHint };
export type CellCoords = { i: number, j: number, k: number };

export namespace PuzzleGenerator {

    export function getInformativeHints(
        puzzle: PicrossPuzzle,
        removed_hints?: Set<number>
    ): IndexedLineCoords[] {

        const hints = [];
        let idx = 0;

        for (let d: LineDirection = 0; d < 3; d++) {
            for (let x = 0; x < puzzle.shape.dims[coord_x[d]]; x++) {
                for (let y = 0; y < puzzle.shape.dims[coord_y[d]]; y++) {
                    if (removed_hints === undefined || !removed_hints.has(idx)) {
                        const hint = puzzle.getLineHint(x, y, d);
                        if (hint !== null) {
                            const state = puzzle.shape.getLine(x, y, d);
                            const info = PicrossSolver.lineSolve(hint, state);
                            if (info && (info.blocks.length !== 0 || info.blanks.length !== 0)) {
                                hints.push({ x, y, d, idx });
                            }
                        }
                    }
                    idx++;
                }
            }
        }

        return hints;
    }

    export function getLineIdx(x: number, y: number, d: number, dims: number[]): number {

        let idx = 0;

        for (let _d = 0; _d < d; _d++) {
            idx += dims[coord_x[_d]] * dims[coord_y[_d]];
        }

        idx += x * dims[coord_y[d]] + y;

        return idx;
    }

    // a.k.a lines to which this cell belongs(1 by direction)
    export function getConnectedLines(
        cell: CellCoords,
        dims: number[],
        excluded_dir: LineDirection = null
    ): IndexedLineCoords[] {

        const { i, j, k } = cell;

        const lines = [];

        if (excluded_dir !== LineDirection.row) {
            lines.push({ x: j, y: k, d: LineDirection.row, idx: getLineIdx(j, k, LineDirection.row, dims) });
        }

        if (excluded_dir !== LineDirection.col) {
            lines.push({ x: i, y: k, d: LineDirection.col, idx: getLineIdx(i, k, LineDirection.col, dims) });
        }

        if (excluded_dir !== LineDirection.row) {
            lines.push({ x: i, y: j, d: LineDirection.depth, idx: getLineIdx(i, j, LineDirection.depth, dims) });
        }

        return lines;
    }

}