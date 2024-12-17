import Renderer from "./Renderer.ts";
import MoveMode from "../mode/MoveMode.ts";
import PhysicBody from "../core-physic/PhysicBody.ts";
import Vec2 from "../utils/Vector.ts";
import ShapeStyle from "../style/ShapeStyle.ts";
import Draw from "../core/Draw.ts";

export default class MoveModeRenderer implements Renderer {
    move_mode: MoveMode;

    public drag_rectangle: ShapeStyle = new ShapeStyle({
        fill_color: 'rgba(3,144,252,0.28)',
        stroke_color: '#0390fc',
        line_width: 1,
    });

    constructor(move_mode: MoveMode) {
        this.move_mode = move_mode;
    }

    public draw(_ctx: CanvasRenderingContext2D, _steps: number) {
        return;
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

    public drawSelection(_ctx: CanvasRenderingContext2D) {
        return;
    }
}