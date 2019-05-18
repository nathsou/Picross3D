import horse from '../../res/puzzles/animals/horse.json';
import platypus from '../../res/puzzles/animals/platypus.json';
import suzanne from '../../res/puzzles/animals/suzanne.json';
import pyramid from '../../res/puzzles/egypt/pyramid.json';
import sphinx from '../../res/puzzles/egypt/sphinx.json';
import chair from '../../res/puzzles/furniture/chair.json';
import computer from '../../res/puzzles/furniture/computer.json';
import strange_tree from '../../res/puzzles/nature/strange_tree.json';
import simple_hints from '../../res/puzzles/tutorial/simple_hints.json';

import { PuzzleHints } from "./PicrossPuzzle";
import { isObject } from '../Utils/Utils';

export interface PuzzleJSON {
    dims: number[],
    hints: PuzzleHints,
    name: string
}

export function isPuzzleJSON(json: any): json is PuzzleJSON {

    if (isObject(json)) {

        const dims = json['dims'];

        return Array.isArray(dims) &&
            dims.length === 3 &&
            Array.isArray(json['hints']) &&
            json['hints'].length === 3 &&
            // getArrayDims(json['hints']).every((d, i) => dims[i] === d) &&
            typeof json['name'] === 'string';
    }

    return false;
}

export const puzzles: { [key: string]: PuzzleJSON } = {
    horse,
    platypus,
    suzanne,
    chair,
    computer,
    sphinx,
    pyramid,
    strange_tree,
    simple_hints
};