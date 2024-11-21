import PointMass from "../core-physic/PointMass";
import Vec2 from "../utils/math/Vector";
import { MouseButton } from "./Editor";
import EditorCreateMode from "./EditorCreateMode";

export default class EditorCreatePointMassMode extends EditorCreateMode {
	override onClick(button: MouseButton, pos: Vec2): void {
		if (button === MouseButton.LEFT) {
			this.createPointMass(pos);
		} else if (button === MouseButton.RIGHT) {
			this.cancelMode();
		}
	}

	createPointMass(pos: Vec2) {
		const pointmass = new PointMass({ position: pos });
		this.editor.addPointMass(pointmass);
	}
}
