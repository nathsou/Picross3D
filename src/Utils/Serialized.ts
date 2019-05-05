
export interface Serialized<T, SerializedType = string> {
    raw: T,
    serialized: SerializedType
}