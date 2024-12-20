export default interface Serializable {
    serialize(): Record<string, unknown>;
    deserialize(data: Record<string, unknown>): void;
}