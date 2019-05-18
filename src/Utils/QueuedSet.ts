import { ArrayCollection } from "./ArrayCollection";

export type Serializable = number | string;

export type IdGetter<T, K extends Serializable> = (val: T) => K;

// A queue with unique elements, identified by an id
export class QueuedSet<T, K extends Serializable = number> {

    private ids: Set<K>;
    protected values: ArrayCollection<T>;
    private id_getter: IdGetter<T, K>;

    constructor(id_getter: IdGetter<T, K>, ...vals: readonly T[]) {
        this.ids = new Set<K>();
        this.values = new ArrayCollection<T>(...vals);

        this.id_getter = id_getter;
        this.add(...vals);
    }

    public add(...vals: T[]): void {
        for (const val of vals) {
            const id = this.id_getter(val);
            if (!this.ids.has(id)) {
                this.ids.add(id);
                this.values.unshift(val);
            }
        }
    }

    public pop(): T {
        const val = this.values.pop();
        this.ids.delete(this.id_getter(val));

        return val;
    }

    public clear(): void {
        this.ids.clear();
        this.values.clear();
    }

    public get size(): number {
        return this.ids.size;
    }

    public empty(): boolean {
        return this.ids.size === 0;
    }
}