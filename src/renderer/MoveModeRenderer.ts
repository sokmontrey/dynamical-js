import IRenderer from "./IRenderer.ts";
import MoveMode from "../mode/MoveMode.ts";

export default class MoveModeRenderer implements IRenderer {
    move_mode: MoveMode;

    constructor(move_mode: MoveMode) {
        this.move_mode = move_mode;
    }

    draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer {
        throw new Error("Method not implemented.");
    }

    drawBoundingBox(ctx: CanvasRenderingContext2D): IRenderer {
        return this;
    }
}