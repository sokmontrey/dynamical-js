import Renderer from "./Renderer.ts";
import CreatePointMassMode from "../mode/CreatePointMassMode.ts";
import CircleStyle from "../style/CircleStyle.ts";
import Draw from "../core/Draw.ts";
import Vec2 from "../utils/Vector.ts";

export default class CreatePointMassModeRenderer implements Renderer {
    create_mode: CreatePointMassMode;

    static hint_circle: CircleStyle = new CircleStyle({
        radius: 10,
        fill_color: 'rgba(0,100,0,0.5)',
        stroke_color: 'rgba(0,255,0,1)',
        is_stroke: true,
        line_width: 1
    });

    constructor(create_mode: CreatePointMassMode) {
        this.create_mode = create_mode;
    }

    // TODO: when editor mode renderering is seperated from the physic body renderer
    // the following method should be removed
    public draw(_ctx: CanvasRenderingContext2D, _steps: number) {
        return;
    }

    public drawHint(ctx: CanvasRenderingContext2D, pos: Vec2): Renderer {
        Draw.circle(ctx, pos, CreatePointMassModeRenderer.hint_circle);
        return this;
    }

    // TODO: when editor mode renderering is seperated from the physic body renderer
    // the following method should be removed
    public drawSelection(_ctx: CanvasRenderingContext2D) {
        return;
    }
}