import IRenderer from "./IRenderer.ts";
import CreatePointMassMode from "../mode/CreatePointMassMode.ts";

export default class CreatePointMassModeRenderer implements IRenderer {
    create_mode: CreatePointMassMode;

    constructor(create_mode: CreatePointMassMode) {
        this.create_mode = create_mode;
    }

    draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer {
        throw new Error("Method not implemented.");
    }
}