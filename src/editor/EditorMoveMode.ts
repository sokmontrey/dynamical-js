import EditorMoveModeRenderer from "../renderer/editor/EditorMoveModeRenderer";
import Renderer from "../renderer/Renderer";
import Vec2 from "../utils/math/Vector";
import Editor, { MouseButton } from "./Editor";
import EditorMode from "./EditorMode";

export default class EditorMoveMode implements EditorMode {
    editor: Editor;
    renderer: Renderer;

	constructor(editor: Editor) {
		this.editor = editor;
		this.renderer = new EditorMoveModeRenderer(this);
	}

    onClick(button: MouseButton, pos: Vec2): void {
        throw new Error("Method not implemented.");
    }

    onDrag(button: MouseButton, start: Vec2, end: Vec2): void {
        throw new Error("Method not implemented.");
    }

    onMouseMove(is_mouse_down: boolean, pos: Vec2): void {
        throw new Error("Method not implemented.");
    }

}
