import BodyRenderer from "../../core/BodyRenderer";
import Draw from "../../core/Draw";
import CircleStyle, { CircleStyleProps } from "../../style/CircleStyle";
import LineStyle, { LineStyleProps } from "../../style/LineStyle";
import Vec2 from "../../utils/Vector";
import CircularKinematic from "./Body";

export interface CircularKinematic_RendererProps {
    radius_line?: LineStyleProps;
    motion_path?: CircleStyleProps;
    selected?: CircleStyleProps;
}

export default class CircularKinematic_Renderer extends BodyRenderer<CircularKinematic> {
    motion_path: CircleStyle;
    selected: CircleStyle;
    radius_line: LineStyle;

    constructor(props: CircularKinematic_RendererProps) {
        super();
        this.motion_path = new CircleStyle(props.motion_path);
        this.selected = new CircleStyle(props.selected);
        this.radius_line = new LineStyle(props.radius_line);
    }

    draw(circular_kinematic: CircularKinematic, ctx: CanvasRenderingContext2D, _steps: number): void {
        const [
            center_pm,
            anchor_pm
        ] = circular_kinematic.getPointMasses();
        const center = center_pm.getPosition();
        const anchor = anchor_pm.getPosition();
        const radius = circular_kinematic.getRadius();

        this.drawRadiusLine(ctx, center, anchor);
        this.drawMotionPath(ctx, center, radius);
    }

    drawSelection(circular_kinematic: CircularKinematic, ctx: CanvasRenderingContext2D): void {
        const [ center_pm ] = circular_kinematic.getPointMasses();
        const center = center_pm.getPosition();
        this.selected.radius = circular_kinematic.getRadius();
        Draw.circle(ctx, center, this.selected);
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
}