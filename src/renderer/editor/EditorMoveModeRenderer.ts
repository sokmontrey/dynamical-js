import Draw from "../../core/Draw";
import EditorMoveMode from "../../editor/EditorMoveMode";
import ShapeStyle from "../../style/ShapeStyle";
import Renderer from "../Renderer";

export default class EditorMoveModeRenderer implements Renderer {
	private editor_move_mode: EditorMoveMode;
	public readonly drag_rectangle: ShapeStyle;

	constructor(editor_move_mode: EditorMoveMode) {
		this.editor_move_mode = editor_move_mode;
		this.drag_rectangle = new ShapeStyle()
			.setFillColor("#4287f522")
			.setStrokeColor("#4287f5")
			.setLineWidth(2)
			.stroke();
	}

	drawDraggingRectangle(ctx: CanvasRenderingContext2D) {
		if (!this.drag_rectangle.isEnable()) return;
		if (!this.editor_move_mode.isDragging()) return;
		const start = this.editor_move_mode.getMouseStartPosition();
		const end = this.editor_move_mode.getMouseCurrentPosition();
		const dim = end.sub(start);
		Draw.rectangle(ctx, start, dim, this.drag_rectangle);
	}

    draw(ctx: CanvasRenderingContext2D, _steps: number): Renderer {
		this.drawDraggingRectangle(ctx);
		return this;
    }
}
