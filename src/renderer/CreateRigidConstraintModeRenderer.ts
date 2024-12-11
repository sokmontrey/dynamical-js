import IRenderer from "./IRenderer.ts";
import CreateRigidConstraintMode from "../mode/CreateRigidConstraintMode.ts";
import PointMass from "../core-physic/PointMass.ts";
import LineStyle from "../style/LineStyle.ts";
import Vec2 from "../utils/Vector.ts";
import Draw from "../core/Draw.ts";

export default class CreateRigidConstraintModeRenderer implements IRenderer {
    create_mode: CreateRigidConstraintMode;

    public constraint_line: LineStyle;

    constructor(create_mode: CreateRigidConstraintMode) {
        this.create_mode = create_mode;
        this.constraint_line = new LineStyle()
            .setStrokeColor('rgba(0,255,0,0.5)')
            .setLineWidth(1);
    }

    draw(_ctx: CanvasRenderingContext2D, _steps: number): IRenderer {
        return this;
    }

    drawSelection(_ctx: CanvasRenderingContext2D): IRenderer {
        return this;
    }

    drawSelectedPointmass(ctx: CanvasRenderingContext2D, hovered_pointmass: PointMass) {
        hovered_pointmass.renderer.drawSelection(ctx);
    }

    drawConstraintLine(ctx: CanvasRenderingContext2D, position: Vec2, mouse_pos: Vec2) {
        Draw.line(ctx, position, mouse_pos, this.constraint_line);
    }
}