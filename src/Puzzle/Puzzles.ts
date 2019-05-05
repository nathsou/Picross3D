
// async function fetchPuzzle(path) {
//     return await (await fetch(`../../res/puzzles/${collection}/${name}.json`));
// }

///@ts-ignore
import horse from '../../res/puzzles/animals/horse.json';
///@ts-ignore
import platypus from '../../res/puzzles/animals/platypus.json';
///@ts-ignore
import pyramid from '../../res/puzzles/egypt/pyramid.json';
///@ts-ignore
import sphinx from '../../res/puzzles/egypt/sphinx.json';
///@ts-ignore
import chair from '../../res/puzzles/furniture/chair.json';
///@ts-ignore
import strange_tree from '../../res/puzzles/nature/strange_tree.json';
///@ts-ignore
import simple_hints from '../../res/puzzles/tutorial/simple_hints.json';
import { PuzzleHints } from "./PicrossPuzzle";

export interface PuzzleJSON {
    dims: number[],
    hints: PuzzleHints,
    name: string
}

export function isPuzzleJSON(json: any): json is PuzzleJSON {
    const dims = json['dims'];

    return Array.isArray(dims) &&
        dims.length === 3 &&
        Array.isArray(json['hints']) &&
        json['hints'].length === 3 &&
        // getArrayDims(json['hints']).every((d, i) => dims[i] === d) &&
        typeof json['name'] === 'string';
}

export const puzzles: { [key: string]: PuzzleJSON } = {
    horse,
    platypus,
    chair,
    sphinx,
    pyramid,
    strange_tree,
    simple_hints
};