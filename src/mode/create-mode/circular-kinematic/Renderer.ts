import PointMass from "@/body/point-mass/Body";
import Draw from "@/core/Draw";
import ModeRenderer from "@/core/ModeRenderer";
import InputManager from "@/manager/InputManager";
import CircleStyle from "@/style/CircleStyle";
import Vec2 from "@/utils/Vector";
import CircularKinematic_CreateMode from "./Mode";

export default class CircularKinematic_CreateModeRenderer extends ModeRenderer {
    public circle_path: CircleStyle = new CircleStyle({
        stroke_color: 'rgba(0,255,0,0.5)',
        line_width: 1,
        is_fill: false
    });

    public draw(
        ctx: CanvasRenderingContext2D,
    ): void {
        const _mode = this.mode as CircularKinematic_CreateMode;
        this.drawHoveredPointMass(ctx, _mode.getHoveredPointMass());
        this.drawSelectedPointMass(ctx, _mode.getCenterPointMass(), InputManager.getMousePosition());
    }

    private drawHoveredPointMass(
        ctx: CanvasRenderingContext2D,
        hovered_pointmass: PointMass | null
    ): void {
        if (!hovered_pointmass) return;
        hovered_pointmass.renderer.drawSelection(hovered_pointmass, ctx);
    }

    /**
     * Draw a select over the selected pointmass and
     * Draw a line from the first pointmass to the current mouse position
     */
    private drawSelectedPointMass(
        ctx: CanvasRenderingContext2D,
        first_pointmass: PointMass | null,
        mouse_pos: Vec2
    ) {
        if (!first_pointmass) { return; }
        first_pointmass.renderer.drawSelection(first_pointmass, ctx);
        const pm_pos = first_pointmass.getPosition();
        this.circle_path.radius = pm_pos.distance(mouse_pos);
        Draw.circle(ctx, pm_pos, this.circle_path);
    }
}