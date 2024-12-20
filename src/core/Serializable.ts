export default interface Serializable<T> {
    serialize(): T;
    deserialize(data: T): void;
}