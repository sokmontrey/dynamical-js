import CreateCircularKinematicMode from "../mode/CreateCircularKinematicMode.ts";
import PointMass from "../core-physic/PointMass.ts";
import Vec2 from "../utils/Vector.ts";
import Draw from "../core/Draw.ts";
import ModeRenderer from "./ModeRenderer.ts";
import InputManager from "../manager/InputManager.ts";
import CircleStyle from "../style/CircleStyle.ts";

export default class CreateCircularKinematicModeRenderer extends ModeRenderer {
    public circle_path: CircleStyle = new CircleStyle({
        stroke_color: 'rgba(0,255,0,0.5)',
        line_width: 1,
        is_fill: false
    });

    public draw(
        ctx: CanvasRenderingContext2D,
    ): void {
        const _mode = this.mode as CreateCircularKinematicMode;
        this.drawHoveredPointMass(ctx, _mode.getHoveredPointMass());
        this.drawSelectedPointMass(ctx, _mode.getCenterPointMass(), InputManager.getMousePosition());
    }

    private drawHoveredPointMass(
        ctx: CanvasRenderingContext2D,
        hovered_pointmass: PointMass | null
    ): void {
        if (!hovered_pointmass) return;
        hovered_pointmass.renderer.drawSelection(ctx);
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
        first_pointmass.renderer.drawSelection(ctx);
        const pm_pos = first_pointmass.getPosition();
        this.circle_path.radius = pm_pos.distance(mouse_pos);
        Draw.circle(ctx, pm_pos, this.circle_path);
    }
}