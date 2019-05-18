import { IdGetter, Serializable } from "./QueuedSet";
import { ArrayCollection } from "./ArrayCollection";

export type ScoreFunc<T> = (val: T) => number;

export class SortedArray<T, K extends Serializable = number> extends ArrayCollection<T> {

    private score_func: ScoreFunc<T>;
    private sort_cache: Map<K, number>;
    private id_getter: IdGetter<T, K>;
    private max_cache_size: number;
    private static DEFAULT_MAX_CACHE_SIZE = 64;

    constructor(score_func: ScoreFunc<T>, id_getter: IdGetter<T, K>, ...values: T[]) {
        super(...values.sort((a, b) => score_func(a) - score_func(b)));
        this.score_func = score_func;
        this.id_getter = id_getter;
        this.max_cache_size = SortedArray.DEFAULT_MAX_CACHE_SIZE;
        this.sort_cache = new Map<K, number>();
    }

    public add(...vals: T[]): void {
        for (const val of vals) {
            this.insert(this.binaryInsertIdx(val, 0, this.size - 1), val);
        }
    }

    private score(val: T): number {
        const id = this.id_getter(val);
        if (!this.sort_cache.has(id)) {
            if (this.sort_cache.size >= this.max_cache_size) {
                this.sort_cache.clear();
            }
            this.sort_cache.set(id, this.score_func(val));
        }

        return this.sort_cache.get(id);
    }

    private greater(a: T, b: T): boolean {
        return this.score(a) > this.score(b);
    }

    // insert while preserving order in O(log(n))
    private binaryInsertIdx(val: T, from: number, to: number): number {

        if (from === to) {
            return from;
        }

        if (this.greater(val, this.at(to))) {
            return to + 1;
        }

        if (this.greater(this.at(from), val)) {
            return 0;
        }

        const middle = from + Math.floor((to - from) / 2);

        if (this.greater(val, this.at(middle))) {
            return this.binaryInsertIdx(val, middle + 1, to);
        } else {
            return this.binaryInsertIdx(val, from, middle - 1);
        }
    }

    public setMaxCacheSize(max_size: number): void {
        this.max_cache_size = max_size;
    }

    public clear(): void {
        super.clear();
        this.sort_cache.clear();
    }

}