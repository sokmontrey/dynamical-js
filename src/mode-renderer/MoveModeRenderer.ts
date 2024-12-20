import MoveMode from "../mode/MoveMode.ts";
import PhysicBody from "../core-physic/PhysicBody.ts";
import Vec2 from "../utils/Vector.ts";
import ShapeStyle from "../style/ShapeStyle.ts";
import Draw from "../core/Draw.ts";
import ModeRenderer from "./ModeRenderer.ts";

export default class MoveModeRenderer extends ModeRenderer {
    public drag_rectangle: ShapeStyle = new ShapeStyle({
        fill_color: 'rgba(3,144,252,0.28)',
        stroke_color: '#0390fc',
        line_width: 1,
    });

    public draw(
        ctx: CanvasRenderingContext2D,
    ) {
        const _mode = this.mode as MoveMode;
        this.drawHoveredBody(ctx, _mode.getHoveredBody());
        this.drawSelectedBodies(ctx, _mode.getSelectedBodies());
        if (_mode.isDragging() && !_mode.isMouseDownOnSelectedBody()) {
            this.drawDraggingBox(ctx, _mode.getMouseDownPosition(), _mode.getMouseCurrentPosition());
        }
    }

    private drawHoveredBody(
        ctx: CanvasRenderingContext2D,
        hovered_body: PhysicBody | null
    ) {
        hovered_body?.renderer.drawSelection(ctx);
    }

    private drawSelectedBodies(
        ctx: CanvasRenderingContext2D,
        bodies: Set<PhysicBody>
    ) {
        bodies.forEach(body => {
            body.renderer.drawSelection(ctx);
        });
    }

    private drawDraggingBox(
        ctx: CanvasRenderingContext2D,
        start: Vec2,
        end: Vec2
    ) {
        const pos = Vec2.min(start, end);
        const dim = end.sub(start).abs();
        Draw.rectangle(ctx, pos, dim, this.drag_rectangle);
    }
}