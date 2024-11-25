import Draw from "../../core/Draw";
import EditorMoveMode from "../../editor/EditorMoveMode";
import ShapeStyle from "../../style/ShapeStyle";
import IRenderer from "../IRenderer";

export default class EditorMoveModeRenderer implements IRenderer {
	private editor_mode: EditorMoveMode;
	public readonly drag_rectangle: ShapeStyle;

	constructor(editor_mode: EditorMoveMode) {
		this.editor_mode = editor_mode;
		this.drag_rectangle = new ShapeStyle()
			.setFillColor("#4287f522")
			.setStrokeColor("#4287f5")
			.setLineWidth(2)
			.stroke();
	}

	drawDraggingRectangle(ctx: CanvasRenderingContext2D) {
		if (!this.drag_rectangle.isEnable()) return;
		if (!this.editor_mode.isDragging()) return;
		const start = this.editor_mode.getMouseStartPosition();
		const end = this.editor_mode.getMouseCurrentPosition();
		const dim = end.sub(start);
		Draw.rectangle(ctx, start, dim, this.drag_rectangle);
	}

    draw(ctx: CanvasRenderingContext2D, _steps: number): IRenderer {
		this.drawDraggingRectangle(ctx);
		return this;
    }
}
