
export type Serializable = number | string;

export type IdGetter<T, K extends Serializable> = (val: T) => K;

// A queue with unique elements, identified by an id
export class QueuedSet<T, K extends Serializable> {

    private ids: Set<K>;
    private values: T[];
    private id_getter: IdGetter<T, K>;

    constructor(id_getter: IdGetter<T, K>, ...vals: readonly T[]) {
        this.ids = new Set<K>();
        this.values = [];
        this.id_getter = id_getter;
        this.enqueue(...vals);
    }

    public enqueue(...vals: T[]): void {
        for (const val of vals) {
            const id = this.id_getter(val);
            if (!this.ids.has(id)) {
                this.ids.add(id);
                this.values.unshift(val);
            }
        }
    }

    public dequeue(): T {
        const val = this.values.pop();
        this.ids.delete(this.id_getter(val));

        return val;
    }

    public clear(): void {
        this.ids.clear();
        this.values = [];
    }

    public get size(): number {
        return this.ids.size;
    }
}