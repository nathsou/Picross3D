import { HintScorer, lineSolveHintScorer2 } from "./HintScorer";
import { PicrossPuzzle } from "./../Puzzle/PicrossPuzzle";
import { CellState, HintType, LineDirection, LineHint, PicrossShape } from "./../PicrossShape";
import { compositions, init2dArray, max3d, reverse } from "./../Utils/Utils";

export type LineState = CellState[];

interface BlockPosition {
    start: number,
    len: number
}

type BlankPosition = BlockPosition;
type BlockRange = BlockPosition;

export interface LineInfo {
    blocks: BlockPosition[],
    blanks: BlankPosition[]
}

export enum PuzzleDifficulty {
    simple, medium, hard
}

export namespace PicrossSolver {

    function simpleLeftMost(seq: number[], line: LineState): BlockPosition[] {

        const blocks: BlockPosition[] = [];
        let last_block_end = 0;

        loop:
        for (let i = 0; i < seq.length; i++) {

            let placed = false;
            for (let j = last_block_end; j <= line.length - seq[i]; j++) {
                // check if the ith block can be placed at idx i
                // i.e (1) it doesn't overlap a blank cell
                // and (2) it doesn't have painted cells immediately before or after the block

                const end = j + seq[i];

                // checking (1)
                const overlaps_blank = line.slice(j, end).some(state => state === CellState.blank);

                // checking (2)
                const next_to_painted_cell =
                    (j !== 0 ? line[j - 1] === CellState.painted : false) ||
                    (end < line.length ? line[end] === CellState.painted : false);

                if (!(overlaps_blank || next_to_painted_cell)) {
                    // a valid position has been found
                    blocks.push({
                        start: j,
                        len: seq[i]
                    });

                    last_block_end = end + 1;
                    placed = true;
                    continue loop;
                }
            }

            if (!placed) {
                return null;
                // throw new Error(`Could not find a valid position for block ${i + 1} of length ${seq[i]}`);
            }
        }

        return blocks;
    }

    function rightMostUnassignedBlock(blocks: BlockPosition[], line: LineState): BlockPosition | null {
        let len = 0, end = 0;

        for (let i = line.length - 1; i >= 0; i--) {
            if (line[i] === CellState.painted) {
                // check if any block covers this cell
                if (!blocks.some(b => i >= b.start && i < b.start + b.len)) {
                    if (len === 0) {
                        end = i;
                    }

                    len++;
                }
            } else if (len !== 0) {
                return { start: end + 1 - len, len: len };
            }
        }

        if (len !== 0) {
            return { start: end + 1 - len, len: len };
        }

        return null;
    }

    export function isLineValid(blocks: BlockPosition[], line: LineState): boolean {

        for (const block of blocks) {
            const end = block.start + block.len;

            const overlaps_blank = line.slice(block.start, end)
                .some(state => state === CellState.blank);

            const next_to_painted_cell =
                (block.start !== 0 ? line[block.start - 1] === CellState.painted : false) ||
                (end < line.length ? line[end] === CellState.painted : false);

            if (overlaps_blank || next_to_painted_cell) {
                return false;
            }
        }

        return true;
    }

    export function leftMost(seq: number[], line: LineState): BlockPosition[] {

        const blocks = simpleLeftMost(seq, line);
        if (blocks === null) return null;

        let rightmost_unassigned: BlockPosition;

        while ((rightmost_unassigned = rightMostUnassignedBlock(blocks, line)) !== null) {
            // get the rightmost block to the left of the unassigned block
            let block_idx: number;

            for (let i = blocks.length - 1; i >= 0; i--) {
                if (blocks[i].start < rightmost_unassigned.start) {
                    block_idx = i;
                    break;
                }
            }

            if (block_idx === undefined) {
                return null;
            }

            let block = blocks[block_idx];

            // move the block so that its right edge overlaps the unassigned block
            const offset = (rightmost_unassigned.start + rightmost_unassigned.len) -
                (block.start + block.len);

            block.start += offset;
            let shifts = 0;

            while (
                shifts !== (block.len - rightmost_unassigned.len) &&
                block.start + block.len < line.length &&
                !isLineValid(blocks, line)
            ) {
                block.start++;
                shifts++;
            }

            if (!isLineValid(blocks, line)) {
                // if we get here then there is no valid way to overlap this block and the unassigned block

                if (block_idx > 0) {
                    // get the block to the left of the one we just tried
                    for (let i = block_idx - 1; i >= 0; i--) {
                        block = blocks[i];
                        // move the block so that its right edge overlaps the unassigned block
                        const offset = (rightmost_unassigned.start + rightmost_unassigned.len) -
                            (block.start + block.len);

                        block.start += offset;
                        let shifts = 0;

                        while (
                            !isLineValid([block], line) &&
                            block.start + block.len < line.length &&
                            shifts !== (block.len - rightmost_unassigned.len)
                        ) {
                            block.start++;
                            shifts++;
                        }

                        if (isLineValid([block], line)) {
                            // reposition all blocks to the right of this block
                            if (i !== blocks.length - 1) {
                                const seq = blocks.slice(i + 1).map(b => b.len);
                                const offset = block.start + block.len + 1;
                                let new_pos = leftMost(seq, line.slice(offset));

                                if (new_pos === null) return null;

                                for (let j = i + 1, c = 0; j < blocks.length; j++ , c++) {
                                    new_pos[c].start += offset;
                                    blocks[j] = new_pos[c];
                                }
                            }

                            break;
                        }
                    }
                }
            }
        }

        return blocks;
    }

    export function rightMost(seq: number[], line: LineState): BlockPosition[] {
        const lm = leftMost(reverse(seq), reverse(line));
        if (lm === null) return null;

        const blocks = reverse(lm);

        // reverse the solution
        for (const block of blocks) {
            block.start = line.length - (block.start + block.len);
        }

        return blocks;
    }

    export function generateLine(blocks: BlockPosition[], line: LineState): number[] {

        const result = [...line];

        blocks.sort((a, b) => a.start - b.start).forEach((block, idx) => {
            for (let i = block.start; i < block.start + block.len; i++) {
                result[i] = -(idx + 1);
            }
        });

        return result;
    }

    export function lineSolveSequence(seq: number[], line: LineState): LineInfo {

        // handle simple cases first

        if (seq.length === 1) {
            // empty line
            if (seq[0] === 0) {
                return {
                    blocks: [],
                    blanks: [{ start: 0, len: line.length }]
                };
            }

            // filled line
            if (seq[0] === line.length) {
                return {
                    blocks: [{ start: 0, len: line.length }],
                    blanks: []
                };
            }
        }

        // general case

        const lm_blocks = leftMost(seq, line);
        const rm_blocks = rightMost(seq, line);

        if (lm_blocks === null || rm_blocks === null) return null;

        const lm = generateLine(leftMost(seq, line), line);
        const rm = generateLine(rightMost(seq, line), line);

        const blocks: BlockPosition[] = [];
        let in_block = false;
        let current_block = { start: 0, len: 0 };

        for (let i = 0; i < line.length; i++) {
            if (lm[i] < 0 && rm[i] < 0 && lm[i] === rm[i]) {
                if (in_block) {
                    current_block.len++;
                } else {
                    current_block.start = i;
                    current_block.len = 1;
                    in_block = true;
                }
            } else if (in_block) { // end of current block
                in_block = false;
                blocks.push({ ...current_block });
            }
        }

        if (in_block) {
            blocks.push({ ...current_block });
        }

        return {
            blocks,
            blanks: findBlanks(rm_blocks, lm_blocks, line.length)
        };
    }

    export function findBlanks(rm_blocks: BlockPosition[], lm_blocks: BlockPosition[], line_len: number): BlankPosition[] {

        if (lm_blocks === null || rm_blocks === null) return null;

        const block_ranges: BlockRange[] = rm_blocks.map((b, i) => {
            const lm_start = lm_blocks[i].start;
            return {
                start: lm_start,
                len: (b.start + b.len) - lm_start
            };
        });

        const blanks: BlankPosition[] = [];
        let in_blank = false;
        let current_blank = { start: 0, len: 0 };

        for (let i = 0; i < line_len; i++) {
            if (block_ranges.every(b => (i < b.start) || i >= (b.start + b.len))) {
                if (in_blank) {
                    current_blank.len++;
                } else {
                    current_blank.start = i;
                    current_blank.len = 1;
                    in_blank = true;
                }
            } else if (in_blank) { // end of current block
                in_blank = false;
                blanks.push({ ...current_blank });
            }
        }

        if (in_blank) {
            blanks.push({ ...current_blank });
        }

        return blanks;
    }

    export function blocksIntersection(a: BlockPosition, b: BlockPosition): BlockPosition {
        // make sure that b.start >= a.start
        [a, b] = [a, b].sort((a, b) => a.start - b.start);

        /*
        if (a.start > b.start) {
            [a, b] = [b, a];
        }
        */

        if (a.start + a.len > b.start) {
            return {
                start: b.start,
                len: Math.min((a.start + a.len) - b.start, b.len)
            };
        }

        return null;
    }

    export function lineIntersections(a: LineInfo, b: LineInfo): LineInfo {

        const blocks: BlockPosition[] = [];
        const blanks: BlankPosition[] = [];

        for (let i = 0; i < a.blocks.length; i++) {
            for (let j = 0; j < b.blocks.length; j++) {
                const block_inter = blocksIntersection(a.blocks[i], b.blocks[j]);
                if (block_inter !== null) {
                    blocks.push(block_inter);
                }
            }
        }

        for (let i = 0; i < a.blanks.length; i++) {
            for (let j = 0; j < b.blanks.length; j++) {
                const blank_inter = blocksIntersection(a.blanks[i], b.blanks[j]);
                if (blank_inter !== null) {
                    blanks.push(blank_inter);
                }
            }
        }

        return { blocks, blanks };
    }

    export function lineSolveCircle(sum: number, state: LineState): LineInfo {

        let lineInfo: LineInfo;

        for (let n = 1; n < sum; n++) {
            const line = lineSolveSequence([n, sum - n], state);
            if (line !== null) {
                if (lineInfo !== undefined) {
                    lineInfo = lineIntersections(line, lineInfo);
                } else {
                    lineInfo = line;
                }

                if (lineInfo === null || (lineInfo.blocks.length === 0 && lineInfo.blanks.length === 0)) {
                    return null;
                }
            }
        }

        return lineInfo;
    }

    export function lineSolveRectangle(sum: number, state: LineState): LineInfo {

        let lineInfo: LineInfo;

        for (const comp of compositions(sum)) {
            if (comp.length >= 3) {
                const line = lineSolveSequence(comp, state);
                if (line !== null) {
                    if (lineInfo !== undefined) {
                        lineInfo = lineIntersections(line, lineInfo);
                    } else {
                        lineInfo = line;
                    }

                    if (lineInfo === null || (lineInfo.blocks.length === 0 && lineInfo.blanks.length === 0)) {
                        return null;
                    }
                }
            }
        }

        return lineInfo;
    }

    export function lineSolve(hint: LineHint, state: LineState): LineInfo {

        if (hint === null) {
            return null;
        }

        switch (hint.type) {
            case HintType.simple:
                return lineSolveSequence([hint.num], state);

            case HintType.circle:
                return lineSolveCircle(hint.num, state);

            case HintType.square:
                return lineSolveRectangle(hint.num, state);
        }

        return null;
    }

    // bruteforce
    export function solve(puzzle: PicrossPuzzle): PicrossShape {
        const shape = new PicrossShape(puzzle.getDimensions(), CellState.unknown);

        const remaining_lines = [
            init2dArray(shape.dims[1], shape.dims[2], true),
            init2dArray(shape.dims[0], shape.dims[2], true),
            init2dArray(shape.dims[0], shape.dims[1], true)
        ];

        const incomlete_lines_count = [
            shape.dims[1] * shape.dims[2],
            shape.dims[0] * shape.dims[2],
            shape.dims[0] * shape.dims[1]
        ];

        let changed = true;
        // (j, k), (i, k), (i, j)
        const coord_x = [1, 0, 0]; //j, i, i
        const coord_y = [2, 2, 1]; //k, k, j

        while (changed) {
            changed = false;

            for (let d: LineDirection = 0; d < 3; d++) {
                if (incomlete_lines_count[d] !== 0) {
                    for (let x = 0; x < puzzle.shape.dims[coord_x[d]]; x++) {
                        for (let y = 0; y < puzzle.shape.dims[coord_y[d]]; y++) {
                            if (remaining_lines[d][x][y]) {
                                const state = shape.getLine(x, y, d);
                                if (state.every(cell => cell !== CellState.unknown)) {
                                    remaining_lines[d][x][y] = false;
                                    incomlete_lines_count[d]--;
                                } else {
                                    const info = lineSolve(puzzle.getLineHint(x, y, d), state);
                                    changed = shape.setLine(x, y, d, info) || changed;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (
            incomlete_lines_count[0] > 0 &&
            incomlete_lines_count[1] > 0 &&
            incomlete_lines_count[2] > 0
        ) {
            return null;
            // throw new Error(`LineSolver stuck at iteratiton ${iter}, puzzle might not be line solvable`);
        }

        return shape;
    }

    export function removeHints(
        puzzle: PicrossPuzzle,
        max_fails = 100,
        score_func: HintScorer = lineSolveHintScorer2
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const hints = puzzle.getHints();
            const scores: number[][][] = [];
            const coord_x = [1, 0, 0]; //j, i, i
            const coord_y = [2, 2, 1]; //k, k, j

            // assign a score to each hint
            for (let d: LineDirection = 0; d < 3; d++) {
                scores.push([]);
                for (let x = 0; x < puzzle.shape.dims[coord_x[d]]; x++) {
                    scores[d].push([]);
                    for (let y = 0; y < puzzle.shape.dims[coord_y[d]]; y++) {
                        scores[d][x][y] = score_func(hints[d][x][y], x, y, d, puzzle.shape);
                    }
                }
            }

            // take the top scoring hint
            // test if the puzzle is linesolvable without it
            // if it is remove it, else test next best scoring hint
            let fails = 0;
            while (fails < max_fails) {
                const max = max3d(scores);

                if (max.value === -Infinity) break;

                const hint_copy = { ...hints[max.x][max.y][max.z] };

                hints[max.x][max.y][max.z] = null;
                // make sure this hint won't be selected in the future
                scores[max.x][max.y][max.z] = -Infinity;

                if (!puzzle.isSolvable()) {
                    // restore hint
                    hints[max.x][max.y][max.z] = hint_copy;
                    fails++;
                } else {
                    fails = 0;
                }
            }

            resolve();
        });
    }

}