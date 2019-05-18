import { Collection } from "./Collection";

// Array Collection with O(1) add and unshift operations 
export class ArrayCollection<T> extends Collection<T> {
    protected pushed_values: T[];
    protected unshifted_values: T[];

    constructor(...values: T[]) {
        super();
        this.pushed_values = [...values];
        this.unshifted_values = [];
    }

    public add(...vals: T[]): void {
        this.pushed_values.push(...vals);
    }

    public unshift(...vals: T[]): void {
        this.unshifted_values.push(...vals);
    }

    public at(idx: number): T {
        if (idx < this.unshifted_values.length) {
            return this.unshifted_values[idx];
        }

        return this.pushed_values[idx - this.unshifted_values.length];
    }

    public remove(idx: number): T {
        if (idx < this.unshifted_values.length) {
            return this.unshifted_values.splice(idx, 1)[0];
        }

        return this.pushed_values.splice(idx - this.unshifted_values.length, 1)[0];
    }

    public insert(idx: number, ...vals: T[]): void {
        if (idx < this.unshifted_values.length) {
            this.unshifted_values.splice(idx, 0, ...vals);
        } else {
            this.pushed_values.splice(idx - this.unshifted_values.length, 0, ...vals);
        }
    }

    public clear(): void {
        this.pushed_values = [];
        this.unshifted_values = [];
    }

    public get size(): number {
        return this.unshifted_values.length + this.pushed_values.length;
    }

    public get values(): Readonly<T[]> {
        return [...this.unshifted_values, ...this.pushed_values];
    }

}