import PointMass from "../core-physic/PointMass";
import RigidConstraint from "../core-physic/RigidConstraint";
import Vec2 from "../utils/math/Vector";
import { MouseButton } from "./Editor";
import EditorCreateMode from "./EditorCreateMode";

export default class EditorCreateRigidConstraintMode extends EditorCreateMode {
	private pointmass1: PointMass | null = null;
	private pointmass2: PointMass | null = null;

	override onClick(button: MouseButton, pos: Vec2): void {
		if (button === MouseButton.LEFT) {
			this.selectPointMass(pos);
		} else if (button === MouseButton.RIGHT) {
			this.cancelMode();
		}
	}

	selectPointMass(pos: Vec2) {
		const pointmass = this.editor.pickPointMass(pos);
		if (!pointmass) return;
		if (!(pointmass instanceof PointMass)) return;

		if (!this.pointmass1) { // select first pointmass
			this.pointmass1 = pointmass;
		} else if (pointmass != this.pointmass1) { // select second pointmass
			this.createRigidConstraint();
		}
	}

	createRigidConstraint() {
		if (!this.pointmass1 || !this.pointmass2) return;
		const rigid_constraint = new RigidConstraint(this.pointmass1, this.pointmass1)
		this.editor.addPointMass(rigid_constraint);
		this.reset();
	}

	reset() {
		this.pointmass1 = null;
		this.pointmass2 = null;
	}
}
