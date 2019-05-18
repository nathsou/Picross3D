
export abstract class Collection<T> {

    public abstract add(...vals: T[]): void;

    public abstract at(idx: number): T;

    public abstract remove(idx: number): T;

    public abstract clear(): void;

    public abstract get values(): Readonly<T[]>;

    public abstract get size(): number;

    public abstract unshift(...vals: T[]): void;

    public pop(): T {
        return this.remove(this.size - 1);
    }

    public shift(): T {
        return this.remove(0);
    }

}