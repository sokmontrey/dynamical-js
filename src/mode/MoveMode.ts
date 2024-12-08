import Mode from "./Mode.ts";
import IRenderer from "../renderer/IRenderer.ts";

export default class MoveMode extends Mode {
    public renderer: IRenderer;

    public init(): void {
        throw new Error("Move mode not implemented.");
    }
}