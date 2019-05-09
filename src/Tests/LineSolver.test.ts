import { CellState } from "../PicrossShape";
import { PicrossSolver, BlockPosition } from "../Solver/PicrossSolver";

export const [unk, blank, painted] = [CellState.unknown, CellState.blank, CellState.painted];

export const state = (line: string): CellState[] =>
    line
        .split('')
        .map(c => c === 'x' ? painted : (c === '_' ? blank : unk));

export const line = (state: string): (CellState | number)[] => {
    let block_id = 0, in_block = false;
    const line = [];

    for (let c of state) {
        if (c === 'x') {
            if (!in_block) {
                block_id++;
            }
            line.push(-block_id);
            in_block = true;
        } else if (c === '?') {
            line.push(unk);
            in_block = false;
        } else if (c === '_') {
            line.push(blank);
            in_block = false;
        }
    }

    return line;
};

describe('LineSolver', () => {

    it('should check line validity', () => {
        const blocks: BlockPosition[] = [
            {
                start: 2,
                len: 1
            }, {
                start: 4,
                len: 2
            }
        ];

        expect(PicrossSolver.isLineValid(blocks, state('???????'))).toBe(true);

        // overlapping blank cell
        expect(PicrossSolver.isLineValid(blocks, state('?????_?'))).toBe(false);

        // next to painted cell
        expect(PicrossSolver.isLineValid(blocks, state('?????xx'))).toBe(false);
    });


    it('should find a simple leftmost solution', () => {
        const state1 = state('????');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state1), state1))
            .toEqual(line('x?xx'));

        const state2 = state('?_??');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state2), state2))
            .toEqual(line('x_xx'));

        const state3 = state('?????x?');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state3), state3))
            .toEqual(line('x???xx?'));

        const state4 = state('?????x??');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2, 3], state4), state4))
            .toEqual(line('x?xx?xxx'));
    });

    it('should return null in invalid cases', () => {
        expect(PicrossSolver.leftMost([1, 2, 4], state('?????x??'))).toBeNull();
        expect(PicrossSolver.leftMost([1], state('______'))).toBeNull();
        expect(PicrossSolver.leftMost([4], state('x____x'))).toBeNull();
    });

    it('should shift blocks to fit the state', () => {
        const state1 = state('??????_x?');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state1), state1))
            .toEqual(line('x?????_xx'));

        const state2 = state('?????_x_??????');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2, 3], state2), state2))
            .toEqual(line('?????_x_xx?xxx'));
    });

    it('should reposition blocks', () => {
        const state1 = state('????x??_x_??????');

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 1, 2, 3], state1), state1))
            .toEqual(line('????x??_x_xx?xxx'));
    });
});