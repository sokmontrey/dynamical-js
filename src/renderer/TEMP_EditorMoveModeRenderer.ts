import Draw from "../core/Draw";
import ShapeStyle from "../style/ShapeStyle";
import Vec2 from "../utils/math/Vector";
import Renderer from "./Renderer";

export default class EditorMoveModeRenderer implements Renderer {
	private editor: EditorMoveMode;

	public readonly drag_rectangle: ShapeStyle;

	constructor(editor: EditorMoveMode) {
		this.editor = editor;
		this.drag_rectangle = new ShapeStyle()
			.setFillColor("#4287f522")
			.setStrokeColor("#4287f5")
			.setLineWidth(2)
			.stroke();
	}

	drawDraggingRectangle(ctx: CanvasRenderingContext2D) {
		if (!this.drag_rectangle.isEnable()) return;
		if (!this.editor.isDragging()) return;
		const start = this.editor.getMouseStartPosition();
		const end = this.editor.getMouseCurrentPosition();
		const dim = end.sub(start);
		Draw.rectangle(ctx, start, dim, this.drag_rectangle);
	}

	draw(ctx: CanvasRenderingContext2D, _: number): Renderer {
		this.drawDraggingRectangle(ctx);
		return this;
	}
}
