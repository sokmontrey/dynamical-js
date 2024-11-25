import PointMass from "../core-physic/PointMass";
import EditorCreatePointMassModeRenderer from "../renderer/editor/EditorCreatePointMassModeRenderer";
import Renderer from "../renderer/Renderer";
import Vec2 from "../utils/math/Vector";
import Editor, { MouseButton } from "./Editor";
import EditorMode from "./EditorMode";

export default class EditorCreatePointMassMode implements EditorMode {
    ctx: CanvasRenderingContext2D;
    editor: Editor;
    renderer: Renderer;

	constructor(editor: Editor, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.editor = editor;
		this.renderer = new EditorCreatePointMassModeRenderer(this);
	}

    onDragEnd(_button: MouseButton, _start: Vec2, _end: Vec2): void {
		return;
    }

    onMouseMove(_is_mouse_down: boolean, _pos: Vec2): void {
		return;
    }

	onClick(button: MouseButton, pos: Vec2): void {
		if (button === MouseButton.LEFT) {
			this.createPointMass(pos);
		} else if (button === MouseButton.RIGHT) {
			this.editor.toMoveMode();
		}
	}

	createPointMass(pos: Vec2) {
		const pointmass = new PointMass({ position: pos });
		this.editor.addPointMass(pointmass);
	}
}
