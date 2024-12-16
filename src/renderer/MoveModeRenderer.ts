import IRenderer from "./IRenderer.ts";
import MoveMode from "../mode/MoveMode.ts";
import PhysicBody from "../core-physic/PhysicBody.ts";
import Vec2 from "../utils/Vector.ts";
import ShapeStyle from "../style/ShapeStyle.ts";
import Draw from "../core/Draw.ts";

export default class MoveModeRenderer implements IRenderer {
    move_mode: MoveMode;

    public drag_rectangle: ShapeStyle;

    constructor(move_mode: MoveMode) {
        this.move_mode = move_mode;

        this.drag_rectangle = new ShapeStyle()
            .setFillColor('rgba(3,144,252,0.28)')
            .setStrokeColor('#0390fc')
            .setLineWidth(1);
    }

    getProps() {
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    draw(_ctx: CanvasRenderingContext2D, _steps: number): IRenderer {
        return this;
    }

    public drawHoveredBody(ctx: CanvasRenderingContext2D, hovered_body: PhysicBody | null) {
        hovered_body?.renderer.drawSelection(ctx);
    }

    public drawSelectedBodies(ctx: CanvasRenderingContext2D, bodies: Set<PhysicBody>) {
        bodies.forEach(body => {
            body.renderer.drawSelection(ctx);
        });
    }

    public drawDraggingBox(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2) {
        const pos = Vec2.min(start, end);
        const dim = end.sub(start).abs();
        Draw.rectangle(ctx, pos, dim, this.drag_rectangle);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawSelection(_ctx: CanvasRenderingContext2D): IRenderer {
        return this;
    }
}