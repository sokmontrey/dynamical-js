import Vec2 from "../utils/math/Vector";
import Editor, { MouseButton } from "./Editor";
import EditorMode from "./EditorMode";
import Renderer from "../renderer/Renderer";
import EditorCreateModeRenderer from "../renderer/editor/EditorCreateModeRenderer";

export default abstract class EditorCreateMode implements EditorMode {
	renderer: Renderer;
	editor: Editor;

	constructor(editor: Editor) {
		this.renderer = new EditorCreateModeRenderer(this);
		this.editor = editor;
	}

	onClick(_button: MouseButton, _pos: Vec2): void {
		return;
	}

	onDrag(_button: MouseButton, _start: Vec2, _end: Vec2): void {
		// TODO: implement panning
		return;
	}

	onMouseMove(_is_mouse_down: boolean, _pos: Vec2): void {
		return;
	}

	cancelMode() {
		this.editor.toMoveMode();
	}
}
