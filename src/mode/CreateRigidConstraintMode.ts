import IRenderer from "../renderer/IRenderer.ts";
import Mode from "./Mode.ts";

export default class CreateRigidConstraintMode extends Mode {
    public renderer: IRenderer;

    public init(): void {
        throw new Error("Create rigid constraint mode not implemented.");
    }
}