import IRenderer from "./IRenderer.ts";
import CreatePointMassMode from "../mode/CreatePointMassMode.ts";
import CircleStyle from "../style/CircleStyle.ts";
import Draw from "../core/Draw.ts";
import Vec2 from "../utils/Vector.ts";

export default class CreatePointMassModeRenderer implements IRenderer {
    create_mode: CreatePointMassMode;

    public hint_circle: CircleStyle;

    constructor(create_mode: CreatePointMassMode) {
        this.create_mode = create_mode;
        this.hint_circle = new CircleStyle()
            .setRadius(10)
            .setFillColor('rgba(0,100,0,0.5)')
            .setStrokeColor('rgba(0,255,0,1)')
            .setLineWidth(1);
    }

    getProps() {
        throw new Error("Method not implemented.");
    }

    draw(_ctx: CanvasRenderingContext2D, _steps: number): IRenderer {
        return this;
    }

    drawHint(ctx: CanvasRenderingContext2D, pos: Vec2): IRenderer {
        Draw.circle(ctx, pos, this.hint_circle);
        return this;
    }

    drawSelection(_ctx: CanvasRenderingContext2D): IRenderer {
        return this;
    }
}