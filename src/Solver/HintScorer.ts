import { LineDirection, LineHint, PicrossShape } from "../PicrossShape";
import { PicrossSolver } from "./PicrossSolver";

export type HintScorer = (hint: LineHint, x: number, y: number, dir: LineDirection, shape: PicrossShape) => number;

export const lineSolveHintScorer1: HintScorer = (
    hint: LineHint,
    x: number,
    y: number,
    d: LineDirection,
    shape: PicrossShape
) => {
    const linesolve = PicrossSolver.lineSolve(hint, shape.getLine(x, y, d));

    let score: number;

    if (linesolve !== null) {
        score = (
            (linesolve.blocks.reduce((p, c) => p + c.len, 0) +
                linesolve.blanks.reduce((p, c) => p + c.len, 0)) +
            hint.num * (hint.type + 1)
        ) / shape.dims[d];
    } else {
        score = hint.num / shape.dims[d];
    }

    return score;
};

export const lineSolveHintScorer2: HintScorer = (
    hint: LineHint,
    x: number,
    y: number,
    d: LineDirection,
    shape: PicrossShape
) => {
    const linesolve = PicrossSolver.lineSolve(hint, shape.getLine(x, y, d));

    let score: number;

    if (linesolve) {
        score = (
            (linesolve.blocks.reduce((p, c) => p + c.len, 0) +
                linesolve.blanks.reduce((p, c) => p + c.len, 0)) ** 2 +
            hint.num * (hint.type + 1)
        ) / shape.dims[d];
    } else {
        score = hint.num / shape.dims[d];
    }

    return score;
};


export const simpleHierarchicalHintScorer: HintScorer = (
    hint: LineHint,
    x: number,
    y: number,
    d: LineDirection,
    shape: PicrossShape
) => {
    return hint.num === 0 ? Infinity : hint.num + hint.type;
};

export const normalizedHierarchicalHintScorer: HintScorer = (
    hint: LineHint,
    x: number,
    y: number,
    d: LineDirection,
    shape: PicrossShape
) => {
    return hint.num === 0 ? 1 : (hint.num + hint.type) / shape.dims[d];
};