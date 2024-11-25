import EditorMoveModeRenderer from "../renderer/editor/EditorMoveModeRenderer";
import Vec2 from "../utils/math/Vector";
import Editor, { MouseButton } from "./Editor";
import IEditorMode from "./IEditorMode";

export default class EditorMoveMode implements IEditorMode {
	ctx: CanvasRenderingContext2D;
    editor: Editor;
    renderer: EditorMoveModeRenderer;

	constructor(editor: Editor, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.editor = editor;
		this.renderer = new EditorMoveModeRenderer(this);
	}

    onClick(button: MouseButton, pos: Vec2): void {
		return;
    }

    onDragEnd(button: MouseButton, start: Vec2, end: Vec2): void {
		return;
    }

    onMouseMove(is_mouse_down: boolean, pos: Vec2): void {
		return;
    }

    getMouseCurrentPosition() {
		return this.editor.getMouseCurrentPosition();
    }

    getMouseStartPosition() {
		return this.editor.getMouseStartPosition();
    }

    isDragging() {
		return this.editor.isDragging();
    }
}
