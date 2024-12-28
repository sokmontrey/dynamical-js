import BodyRenderer, { BodyRendererProps } from "../../core/BodyRenderer";
import Draw from "../../core/Draw";
import CircleStyle, { CircleStyleProps } from "../../style/CircleStyle";
import LineStyle, { LineStyleProps } from "../../style/LineStyle";
import Vec2 from "../../utils/Vector";
import CircularKinematic from "./Body";

interface Props extends BodyRendererProps {
    radius_line?: LineStyleProps;
    motion_path?: CircleStyleProps;
    selected?: CircleStyleProps;
}

export default class CircularKinematic_Renderer extends BodyRenderer {
    private circular_kinematic: CircularKinematic;

    public readonly motion_path: CircleStyle;
    public readonly selected: CircleStyle;
    public readonly radius_line: LineStyle;

    constructor(circular_kinematic: CircularKinematic, {
        motion_path = { is_stroke: true, stroke_color: 'gray', line_width: 1, is_fill: false },
        selected = { fill_color: 'rgba(3,144,252,0.28)', stroke_color: '#0390fc', line_width: 1 },
        radius_line = { is_stroke: true, stroke_color: 'gray', line_width: 1 }
    }: Props = {}) {
        super();
        this.circular_kinematic = circular_kinematic;

        this.motion_path = new CircleStyle(motion_path);
        this.selected = new CircleStyle(selected);
        this.radius_line = new LineStyle(radius_line);
    }

    draw(ctx: CanvasRenderingContext2D, _steps: number): void {
        const [
            center_pm,
            anchor_pm
        ] = this.circular_kinematic.getPointMasses();
        const center = center_pm.getPosition();
        const anchor = anchor_pm.getPosition();
        const radius = this.circular_kinematic.getRadius();

        this.drawRadiusLine(ctx, center, anchor);
        this.drawMotionPath(ctx, center, radius);
    }

    private drawRadiusLine(ctx: CanvasRenderingContext2D, center: Vec2, anchor: Vec2): void {
        if (!this.radius_line.is_enable) return;
        Draw.line(ctx, center, anchor, this.radius_line);
    }

    private drawMotionPath(ctx: CanvasRenderingContext2D, center: Vec2, radius: number): void {
        if (!this.motion_path.is_enable) return;
        this.motion_path.radius = radius;
        Draw.circle(ctx, center, this.motion_path);
    }

    drawSelection(ctx: CanvasRenderingContext2D): void {
        const [ center_pm ] = this.circular_kinematic.getPointMasses();
        const center = center_pm.getPosition();
        this.selected.radius = this.circular_kinematic.getRadius();
        Draw.circle(ctx, center, this.selected);
    }
}