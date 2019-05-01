
export type CachePopulator<T, K = string> = (key: K) => T;

export default class CachedSet<T, K = string> {

    private cache: Map<K, T>;
    private populator: CachePopulator<T, K>;

    constructor(populator: CachePopulator<T, K>) {
        this.cache = new Map<K, T>();
        this.populator = populator;
    }

    public get(key: K): T {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const val = this.populator(key);
        this.cache.set(key, val);
        return val;
    }
}