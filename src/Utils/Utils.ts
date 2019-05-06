import { Color } from "three";
import { PicrossShape } from "../PicrossShape";

//https://github.com/mikolalysenko/mikolalysenko.github.com/tree/gh-pages/MinecraftMeshes/js

export let volumes = {
    hole: () => PicrossShape.generate([32, 32, 32], (i, j, k) => Math.abs(i - 7) > 3 || Math.abs(j - 7) > 3),
    cube: () => PicrossShape.generate([8, 8, 8], (i, j, k) => true),
    valley: () => PicrossShape.generate([16, 16, 16], (i, j, k) => j <= (i * i + k * k) * 15 / (16 * 16 * 2) + 1),
    big_valley: () => PicrossShape.generate([32, 32, 32], (i, j, k) => j <= (i * i + k * k) * 31 / (32 * 32 * 2) + 1),
    extra_big_valley: () => PicrossShape.generate([64, 64, 64], (i, j, k) => j <= (i * i + k * k) * 63 / (64 * 64 * 2) + 1),
    T: () => PicrossShape.generate([16, 16, 3], (i, j, k) => ((6 <= i && i < 10 && 2 <= j && j < 13) || (2 <= i && i < 14 && 8 <= j && j < 13))),
    sphere: () => PicrossShape.generate([16, 16, 16], (i, j, k) => i * i + j * j + k * k <= 16 * 16),
    horse: () => new PicrossShape([
        1, 0, 1, 0,
        1, 1, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 1
    ],
        [4, 4, 1]
    ),
    damier_cube: (n = 5) => PicrossShape.generate([n, n, n], (i, j, k) => (i + j + k) % 2 === 0),
    giraffe: () => new PicrossShape([
        0, 1, 0, 0, 1,
        0, 1, 0, 0, 1,
        0, 1, 1, 1, 1,
        0, 1, 1, 1, 1,
        0, 1, 1, 0, 0,
        0, 1, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 1, 0, 0, 0,
        1, 1, 0, 0, 0
    ],
        [5, 9, 1]
    ),

    Y: () => new PicrossShape([
        0, 0, 1, 0, 0,
        0, 0, 1, 0, 0,
        0, 1, 1, 1, 0,
        1, 1, 0, 1, 1,
        1, 0, 0, 0, 1,
    ],
        [5, 5, 1]
    ),

    magnifying_glass: () => new PicrossShape([
        0, 0, 1, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 1, 0, 0,
        0, 1, 1, 1, 0,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        0, 1, 1, 1, 0,

        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 0,
        1, 0, 0, 0, 1,
        1, 0, 0, 0, 1,
        1, 0, 0, 0, 1,
        0, 1, 1, 1, 0
    ],
        [5, 9, 2]
    ),

    handbag: () => new PicrossShape([
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        0, 1, 0, 0, 1, 0,
        0, 0, 1, 1, 0, 0,

        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,

        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        0, 1, 0, 0, 1, 0,
        0, 0, 1, 1, 0, 0,
    ],
        [6, 6, 3]
    )
}

export let colors = {
    white: cache(() => new Color('#ffffff')),
    black: cache(() => new Color('#000000')),
};

export type CachedValue<T> = (update?: boolean) => T;

export function cache<T>(populator: () => T): CachedValue<T> {
    let value: T;
    // necessary since populator() could return undefined
    let cached = false;

    return (update = false) => {
        if (!cached || update) {
            value = populator();
            cached = true;
        }

        return value;
    };
}

export function hex2rgb(hex: number): { r: number, g: number, b: number } {
    hex &= 0xffffff;

    return {
        r: (hex >> 16) / 0xff,
        g: ((hex >> 8) & 0x00ff) / 0xff,
        b: (hex & 0xff) / 0xff
    };
}

export function color2string(color: Color): string {

    let r = Math.floor(color.r * 255).toString(16);
    let g = Math.floor(color.g * 255).toString(16);
    let b = Math.floor(color.b * 255).toString(16);

    r = r.length === 1 ? `${0}${r}` : r;
    g = g.length === 1 ? `${0}${g}` : g;
    b = b.length === 1 ? `${0}${b}` : b;

    return `#${r}${g}${b}`;
}

export let hex_materials = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xffff00,
    0x00ffff,
    0xff00ff,
    0x000000,
    0x23dd31,
    0x964B00,
    0x222222,
    0xaaaaaa
];

export let rgb_materials = hex_materials.map(h => hex2rgb(h));

export interface MeshData {
    vertices: Float32Array,
    colors: Float32Array
}

export function initArray<T>(len: number, value: T): T[] {
    let arr = [];

    for (let i = 0; i < len; i++) {
        arr.push(value);
    }

    return arr;
}

export function init2dArray<T>(width: number, height: number, value: T): T[][] {
    const arr: T[][] = [];

    for (let i = 0; i < width; i++) {
        arr[i] = [];
        for (let j = 0; j < height; j++) {
            arr[i][j] = value;
        }
    }

    return arr;
}

export function init3dArray<T>(width: number, height: number, depth: number, value: T): T[][][] {
    const arr: T[][][] = [];

    for (let i = 0; i < width; i++) {
        arr[i] = [];
        for (let j = 0; j < height; j++) {
            arr[i][j] = [];
            for (let k = 0; k < depth; k++) {
                arr[i][j][k] = value;
            }
        }
    }

    return arr;
}

export function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

//returns a text color with a high contrast when rendered over hex (black or white)
export function getContrastYIQ(color: Color): Color {
    const yiq = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
    return yiq >= 0.5 ? colors.black() : colors.white();
}

export function getArrayDims(arr: unknown[]): number[] {

    const dims = [];
    let a = arr;

    while (Array.isArray(a)) {
        const len = a.length;
        if (len === 0) break;
        dims.push(len);
        a = a[0];
    }

    return dims;
}

export function reverse<T>(a: T[]): T[] {
    const reversed = [];

    for (let i = a.length - 1; i >= 0; i--) {
        reversed.push(a[i]);
    }

    return reversed;
}

export function fill<T>(elem: T, len: number): T[] {
    return new Array(len).fill(elem);
}

export function* compositions(n: number): IterableIterator<number[]> {
    const comps = [fill(1, n)];

    yield comps[0];


    for (const comp of findSets(comps[0], 0)) {
        yield comp;
    }
}

function* findSets(set: number[], start_idx: number): IterableIterator<number[]> {
    if (set[set.length - 1] !== 1 || set.length < 3) {
        return;
    }

    set = set.slice(0, set.length - 1);

    for (let i = start_idx; i < set.length; i++) {
        set[i]++;
        yield [...set];

        for (const s of findSets(set, i)) {
            yield s;
        }

        set[i]--;
    }
}

export function max(a: number[]): { idx: number, value: number } {
    let max_idx = -1;
    let max_val = -Infinity;

    for (let i = 0; i < a.length; i++) {
        if (a[i] > max_val) {
            max_idx = i;
            max_val = a[i];
        }
    }

    return { idx: max_idx, value: max_val };
}

export function max2d(a: number[][]): { x: number, y: number, value: number } {
    let max_x = -1;
    let max_y = -1;
    let max_val = -Infinity;

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            const val = a[i][j];
            if (val > max_val) {
                max_x = i;
                max_y = j;
                max_val = val;
            }
        }
    }

    return { x: max_x, y: max_y, value: max_val };
}

export function max3d(a: number[][][]): { x: number, y: number, z: number, value: number } {
    let max_x = -1;
    let max_y = -1;
    let max_z = -1;

    let max_val = -Infinity;

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            for (let k = 0; k < a[i][j].length; k++) {
                const val = a[i][j][k];
                if (val > max_val) {
                    max_x = i;
                    max_y = j;
                    max_z = k;
                    max_val = val;
                }
            }
        }
    }

    return { x: max_x, y: max_y, z: max_z, value: max_val };
}

export interface Box {
    start: number[],
    dims: number[]
}

// returns a Box such that all dimensions of dims are positive
export function boundingBox(from: number[], to: number[]): Box {

    if (from.length !== to.length) return null;

    const start = [...from];
    const dims = [];

    for (let d = 0; d < from.length; d++) {
        dims[d] = to[d] - from[d];

        if (dims[d] < 0) {
            start[d] = to[d];
            dims[d] *= -1;
        }

        dims[d]++;
    }

    return { start, dims };
}

export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}

export function clampArray(x: number[], min: number[], max: number[]): number[] {
    return x.map((_x, i) => clamp(_x, min[i], max[i]));
}

// rounds x down, such that x % step === 0
export function floorStep(x: number, step: number): number {
    return Math.floor(x / step) * step;
}

// deep merge https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
export function isObject(item: unknown): item is Object {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMerge<T extends { [index: string]: any }>(target: T, ...sources: T[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

export function capitalize(str: string): string {
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}

export function snakify(str: string): string {
    return str.toLowerCase().split(' ').join('_');
}