import Renderer from "./Renderer.ts";
import CreateRigidConstraintMode from "../mode/CreateRigidConstraintMode.ts";
import PointMass from "../core-physic/PointMass.ts";
import LineStyle from "../style/LineStyle.ts";
import Vec2 from "../utils/Vector.ts";
import Draw from "../core/Draw.ts";

// TODO: consider merging this with other create mode renderers
export default class CreateRigidConstraintModeRenderer implements Renderer {
    create_mode: CreateRigidConstraintMode;

    public constraint_line: LineStyle = new LineStyle({
        stroke_color: 'rgba(0,255,0,0.5)',
        line_width: 1
    });

    constructor(create_mode: CreateRigidConstraintMode) {
        this.create_mode = create_mode;
    }

    public draw(_ctx: CanvasRenderingContext2D, _steps: number) {
        return;
    }

    public drawSelection(_ctx: CanvasRenderingContext2D) {
        return;
    }

    public drawSelectedPointmass(ctx: CanvasRenderingContext2D, hovered_pointmass: PointMass) {
        hovered_pointmass.renderer.drawSelection(ctx);
    }

    public drawConstraintLine(ctx: CanvasRenderingContext2D, position: Vec2, mouse_pos: Vec2) {
        Draw.line(ctx, position, mouse_pos, this.constraint_line);
    }
}