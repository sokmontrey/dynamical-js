import ArrowStyle from "@/style/ArrowStyle";
import CircleStyle from "@/style/CircleStyle";
import LineStyle from "@/style/LineStyle";
import ShapeStyle from "@/style/ShapeStyle";
import Vec2 from "@/utils/Vector";

export default class Draw {
	public static fill(ctx: CanvasRenderingContext2D, style: ShapeStyle) {
		if (!style.is_fill) return;
		ctx.fillStyle = style.fill_color;
		ctx.fill();
	}

	public static stroke(ctx: CanvasRenderingContext2D, style: LineStyle) {
		if (!style.is_stroke) return;
		ctx.strokeStyle = style.stroke_color;
		ctx.lineWidth = style.line_width;
		ctx.stroke();
	}

	public static circle(ctx: CanvasRenderingContext2D,
		pos: Vec2,
		style: CircleStyle,
	) {
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, style.radius, 0, 2 * Math.PI);
		ctx.closePath();
		Draw.fill(ctx, style);
		Draw.stroke(ctx, style);
	}

	public static rectangle(ctx: CanvasRenderingContext2D,
		pos: Vec2,
		dimension: Vec2,
		style: ShapeStyle
	) {
		ctx.beginPath();
		ctx.rect(pos.x, pos.y, dimension.x, dimension.y);
		ctx.closePath();
		Draw.fill(ctx, style);
		Draw.stroke(ctx, style);
	}

	public static line(ctx: CanvasRenderingContext2D,
		start: Vec2,
		end: Vec2,
		style: LineStyle
	) {
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.closePath();
		Draw.stroke(ctx, style);
	}

	public static arrow(ctx: CanvasRenderingContext2D,
		origin: Vec2,
		arrow_vector: Vec2,
		style: ArrowStyle,
	) {
		if (arrow_vector.mag() === 0) return;
		const head_pos = origin.add(arrow_vector);
		Draw.line(ctx, origin, head_pos, style);
		Draw.arrowHead(ctx, arrow_vector.norm(), head_pos, style);
	}

	public static arrowHead(ctx: CanvasRenderingContext2D,
		dir: Vec2,
		head_pos: Vec2,
		style: ArrowStyle,
	) {
		head_pos = head_pos.add(dir.mul(5));
		const invt_dir = dir.invert();
		const perp_invt_dir = invt_dir.perp();
		const head_base = head_pos.add(invt_dir.mul(style.head_size));
		const fin = perp_invt_dir.mul(style.head_size * 0.6);
		const barb1 = head_base.add(fin);
		const barb2 = head_base.sub(fin);

		ctx.beginPath();
		ctx.moveTo(head_pos.x, head_pos.y);
		ctx.lineTo(barb1.x, barb1.y);
		ctx.lineTo(barb2.x, barb2.y);
		ctx.lineTo(head_pos.x, head_pos.y);
		ctx.closePath();
		Draw.fill(ctx, style);
	}
}

