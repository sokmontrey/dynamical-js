import CreateRigidConstraintMode from "../mode/CreateRigidConstraintMode.ts";
import PointMass from "../core-physic/PointMass.ts";
import LineStyle from "../style/LineStyle.ts";
import Vec2 from "../utils/Vector.ts";
import Draw from "../core/Draw.ts";
import ModeRenderer from "./ModeRenderer.ts";

export default class CreateRigidConstraintModeRenderer extends ModeRenderer {
    public constraint_line: LineStyle = new LineStyle({
        stroke_color: 'rgba(0,255,0,0.5)',
        line_width: 1
    });

    public draw(
        ctx: CanvasRenderingContext2D,
    ): void {
        const _mode = this.mode as CreateRigidConstraintMode;
        this.drawHoveredPointMass(ctx, _mode.getHoveredPointMass());
        this.drawSelectedPointMass(ctx, _mode.getFirstPointMass(), _mode.getMouseCurrentPosition());
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
        Draw.line(ctx, pm_pos, mouse_pos, this.constraint_line);
    }
}