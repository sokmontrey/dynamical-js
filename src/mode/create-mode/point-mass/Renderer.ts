import Draw from "../../../core/Draw";
import ModeRenderer from "../../../core/ModeRenderer";
import InputManager from "../../../manager/InputManager";
import CircleStyle from "../../../style/CircleStyle";
import Vec2 from "../../../utils/Vector";

export default class PointMass_CreateModeRenderer extends ModeRenderer {
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