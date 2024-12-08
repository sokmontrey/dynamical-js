import Mode from "./Mode.ts";
import CreateRigidConstraintModeRenderer from "../renderer/CreateRigidConstraintModeRenderer.ts";

export default class CreateRigidConstraintMode extends Mode {
    public renderer!: CreateRigidConstraintModeRenderer;

    public init(): void {
        this.renderer = new CreateRigidConstraintModeRenderer(this);
    }
}