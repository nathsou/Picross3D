import { CellState } from "../PicrossShape";
import { PicrossSolver } from "../Solver/PicrossSolver";

describe('Line PicrossSolver', () => {

    it('should check line validity', () => {
        expect(PicrossSolver.isLineValid([
            {
                start: 2,
                len: 1
            }, {
                start: 4,
                len: 2
            }
        ], [
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown
            ])).toBe(true);

        // overlapping blank cell
        expect(PicrossSolver.isLineValid([
            {
                start: 2,
                len: 1
            }, {
                start: 4,
                len: 2
            }
        ], [
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.blank,
                CellState.unknown
            ])).toBe(false);


        // next to painted cell
        expect(PicrossSolver.isLineValid([
            {
                start: 2,
                len: 1
            }, {
                start: 4,
                len: 2
            }
        ], [
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.unknown,
                CellState.painted,
                CellState.painted
            ])).toBe(false);
    });


    it('should find a simple leftmost solution', () => {
        const state1 = [
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.unknown
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state1), state1))
            .toEqual([-1, 0, -2, -2]);

        const state2 = [
            CellState.unknown,
            CellState.blank,
            CellState.unknown,
            CellState.unknown
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state2), state2))
            .toEqual([-1, CellState.blank, -2, -2]);

        const state3 = [
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.painted,
            CellState.unknown
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state3), state3))
            .toEqual([-1, 0, 0, 0, -2, -2, 0]);

        const state4 = [
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.unknown,
            CellState.painted,
            CellState.unknown,
            CellState.unknown
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2, 3], state4), state4))
            .toEqual([-1, 0, -2, -2, 0, -3, -3, -3]);
    });

    // it('should throw an error in invalid cases', () => {
    //     const state = [
    //         CellState.unknown,
    //         CellState.unknown,
    //         CellState.unknown,
    //         CellState.unknown,
    //         CellState.unknown,
    //         CellState.painted,
    //         CellState.unknown,
    //         CellState.unknown
    //     ];

    //     expect(PicrossSolver.leftMost([1, 2, 4], state)).toThrow();
    // });

    it('should shift blocks to fit the state', () => {
        const state = [
            CellState.unknown, // 0
            CellState.unknown, // 1
            CellState.unknown, // 2
            CellState.unknown, // 3
            CellState.unknown, // 4
            CellState.unknown, // 5
            CellState.blank, // 6
            CellState.painted, // 7
            CellState.unknown // 8
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2], state), state))
            .toEqual([-1, 0, 0, 0, 0, 0, 1, -2, -2]);

        const state2 = [
            CellState.unknown, // 0
            CellState.unknown, // 1
            CellState.unknown, // 2
            CellState.unknown, // 3
            CellState.unknown, // 4
            CellState.blank, // 5
            CellState.painted, // 6
            CellState.blank, // 7
            CellState.unknown, // 8
            CellState.unknown, // 9
            CellState.unknown, // 10
            CellState.unknown, // 11
            CellState.unknown, // 12
            CellState.unknown // 13
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 2, 3], state2), state2))
            .toEqual([0, 0, 0, 0, 0, 1, -1, 1, -2, -2, 0, -3, -3, -3]);
    });

    it('should reposition blocks', () => {
        const state = [
            CellState.unknown, // 0
            CellState.unknown, // 1
            CellState.unknown, // 2
            CellState.unknown, // 3
            CellState.painted, // 4
            CellState.unknown, // 5
            CellState.unknown, // 6
            CellState.blank, // 7
            CellState.painted, // 8
            CellState.blank, // 9
            CellState.unknown, // 10
            CellState.unknown, // 11
            CellState.unknown, // 12
            CellState.unknown, // 13
            CellState.unknown, // 14
            CellState.unknown // 15
        ];

        expect(PicrossSolver.generateLine(PicrossSolver.leftMost([1, 1, 2, 3], state), state))
            .toEqual([0, 0, 0, 0, -1, 0, 0, 1, -2, 1, -3, -3, 0, -4, -4, -4]);
    });
});