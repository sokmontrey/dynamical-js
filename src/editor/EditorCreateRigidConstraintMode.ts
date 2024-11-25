import PointMass from "../core-physic/PointMass";
import RigidConstraint from "../core-physic/RigidConstraint";
import EditorCreateRigidConstraintModeRenderer from "../renderer/editor/EditorCreateRigidConstraintModeRenderer";
import Vec2 from "../utils/math/Vector";
import Editor, { MouseButton } from "./Editor";
import EditorMode from "./EditorMode";

export default class EditorCreateRigidConstraintMode implements EditorMode {
    ctx: CanvasRenderingContext2D;
    editor: Editor;
    renderer: EditorCreateRigidConstraintModeRenderer;
	private pointmass1: PointMass | null = null;
	private pointmass2: PointMass | null = null;

	constructor(editor: Editor, ctx: CanvasRenderingContext2D) {
		this.editor = editor;
		this.ctx = ctx;
		this.renderer = new EditorCreateRigidConstraintModeRenderer(this);
	}

    onDragEnd(_button: MouseButton, _start: Vec2, _end: Vec2): void {
		return;
    }

    onMouseMove(_is_mouse_down: boolean, _pos: Vec2): void {
		return;
    }

	onClick(button: MouseButton, pos: Vec2): void {
		if (button === MouseButton.LEFT) {
			this.selectPointMass(pos);
		} else if (button === MouseButton.RIGHT) {
			this.editor.toMoveMode();
		}
	}

	selectPointMass(pos: Vec2) {
		const pointmass = this.editor.pickPointMass(pos);
		if (!pointmass) return;
		if (!(pointmass instanceof PointMass)) return;

		if (!this.pointmass1) { // select first pointmass
			this.pointmass1 = pointmass;
		} else if (pointmass != this.pointmass1) { // select second pointmass
			this.pointmass2 = pointmass;
			this.createRigidConstraint();
		}
	}

	createRigidConstraint() {
		if (!this.pointmass1 || !this.pointmass2) return;
		const rigid_constraint = new RigidConstraint(this.pointmass1, this.pointmass2);
		this.editor.addRigidConstraint(rigid_constraint);
		this.reset();
	}

	reset() {
		this.pointmass1 = null;
		this.pointmass2 = null;
	}
}
