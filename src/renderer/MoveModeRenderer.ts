import IRenderer from "./IRenderer.ts";
import MoveMode from "../mode/MoveMode.ts";

export default class MoveModeRenderer implements IRenderer {
    move_mode: MoveMode;

    constructor(move_mode: MoveMode) {
        this.move_mode = move_mode;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    draw(ctx: CanvasRenderingContext2D, _steps: number): IRenderer {
        this.drawHoveredBody(ctx);
        this.drawSelectedBodies(ctx);
        return this;
    }

    private drawHoveredBody(ctx: CanvasRenderingContext2D) {
        this.move_mode.getHoveredBody()?.renderer.drawBoundingBox(ctx);
    }

    private drawSelectedBodies(ctx: CanvasRenderingContext2D) {
        this.move_mode.getPhysicBodies().forEach(body => {
            body.renderer.drawBoundingBox(ctx);
        });
    }

    drawBoundingBox(ctx: CanvasRenderingContext2D): IRenderer {
        return this;
    }
}