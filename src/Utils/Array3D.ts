
export interface IterableWritableArrayLike<T> extends ArrayLike<T> {
    [n: number]: T;
    slice(from: number, to: number): IterableWritableArrayLike<T>;
    [Symbol.iterator](): IterableIterator<T>
}

export interface Coords3D {
    i: number,
    j: number,
    k: number
}

// https://0fps.net/2013/05/22/implementing-multidimensional-arrays-in-javascript/
export class Array3D<T> {

    private _data: IterableWritableArrayLike<T>;
    private _dims: number[];
    private _strides: number[];
    private _offset: number;

    constructor(data: IterableWritableArrayLike<T>, dims: number[]) {
        this._data = data;
        this._dims = dims;
        this._strides = [1, this._dims[0], this._dims[0] * this._dims[1]];
        this._offset = 0;
    }

    public at(i: number, j: number, k: number): T {
        return this._data[this._offset + i * this._strides[0] + j * this._strides[1] + k * this._strides[2]];
    }

    public atIdx(idx: number): T {
        return this.data[idx];
    }

    public set(i: number, j: number, k: number, val: T): void {
        this._data[this._offset + i * this._strides[0] + j * this._strides[1] + k * this._strides[2]] = val;
    }

    public setAtIdx(idx: number, val: T): void {
        this._data[idx] = val;
    }

    public low(w: number, h: number, d: number): Array3D<T> {
        const new_dims = [
            this._dims[0] - w,
            this._dims[0] - h,
            this._dims[0] - d
        ];

        const new_offset = this._offset + w * this._strides[0] + h * this._strides[1] + d * this._strides[2];

        const view = new Array3D(this._data, new_dims);
        view._offset = new_offset;
        view._strides = [...this._strides];

        return view;
    }

    public slice(from: number[], to: number[]): void {
        const idx1 = this.idx(from[0], from[1], from[2]);
        const idx2 = this.idx(to[0], to[1], to[2]);
        this._data = this._data.slice(idx1, idx2);
        this._dims = [
            to[0] - from[0],
            to[1] - from[1],
            to[2] - from[2]
        ];

    }

    public high(w: number, h: number, d: number): Array3D<T> {
        const view = new Array3D(this._data, [w, h, d]);
        view._strides = this._strides;
        view._offset = this._offset;

        return view;
    }

    public idx(i: number, j: number, k: number): number {
        return this._offset + i * this._strides[0] + j * this._strides[1] + k * this._strides[2];
    }

    public idxToCoords(idx: number): number[] {

        const _idx = idx - this._offset;
        const k = Math.floor(_idx / this._strides[2])
        const j = Math.floor((_idx % this._strides[2]) / this._strides[1])
        const i = Math.floor((_idx % this._strides[1]) / this._strides[0]);

        return [i, j, k];
    }

    public clear(): void {
        this._data = [];
    }

    public get dims() {
        return this._dims;
    }

    public get data(): IterableWritableArrayLike<T> {
        return this._data;
    }

}