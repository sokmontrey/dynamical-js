import IRenderer from "./IRenderer.ts";
import MoveMode from "../mode/MoveMode.ts";

export default class MoveModeRenderer implements IRenderer {
    move_mode: MoveMode;

    constructor(move_mode: MoveMode) {
        this.move_mode = move_mode;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    draw(ctx: CanvasRenderingContext2D, _steps: number): IRenderer {
        this.drawBoundingBox(ctx);
        return this;
    }

    drawBoundingBox(ctx: CanvasRenderingContext2D): IRenderer {
        this.move_mode.getPhysicBodies().forEach((body) => {
            body.renderer.drawBoundingBox(ctx);
        });
        return this;
    }
}