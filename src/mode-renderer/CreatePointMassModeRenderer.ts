import CircleStyle from "../style/CircleStyle.ts";
import Draw from "../core/Draw.ts";
import Vec2 from "../utils/Vector.ts";
import ModeRenderer from "./ModeRenderer.ts";
import InputManager from "../manager/InputManager.ts";

export default class CreatePointMassModeRenderer extends ModeRenderer {
    public hint_circle: CircleStyle = new CircleStyle({
        radius: 10,
        fill_color: 'rgba(0,100,0,0.5)',
        stroke_color: 'rgba(0,255,0,1)',
        is_stroke: true,
        line_width: 1
    });

    public draw(
        ctx: CanvasRenderingContext2D,
    ): void {
        this.drawCursor(ctx, InputManager.getMousePosition());
    }

    private drawCursor(
        ctx: CanvasRenderingContext2D,
        pos: Vec2
    ): void {
        Draw.circle(ctx, pos, this.hint_circle);
    }
}