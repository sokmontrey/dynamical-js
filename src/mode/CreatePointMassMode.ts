import IRenderer from "../renderer/IRenderer.ts";
import Mode from "./Mode.ts";

export default class CreatePointMassMode extends Mode {
    public renderer: IRenderer;

    public init() {
        throw new Error("Create pointmass mode not implemented.");
    }
}