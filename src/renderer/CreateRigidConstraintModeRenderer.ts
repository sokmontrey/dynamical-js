import IRenderer from "./IRenderer.ts";
import CreateRigidConstraintMode from "../mode/CreateRigidConstraintMode.ts";

export default class CreateRigidConstraintModeRenderer implements IRenderer {
    create_mode: CreateRigidConstraintMode;

    constructor(create_mode: CreateRigidConstraintMode) {
        this.create_mode = create_mode;
    }

    draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer {
        throw new Error("Method not implemented.");
    }

    drawBoundingBox(ctx: CanvasRenderingContext2D): IRenderer {
        return this;
    }
}