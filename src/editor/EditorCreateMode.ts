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

	abstract onClick(button: MouseButton, pos: Vec2): void;
	abstract onDrag(button: MouseButton, start: Vec2, end: Vec2): void;
	abstract onMouseMove(is_mouse_down: boolean, pos: Vec2): void;
}
