import PointMass from "../core-physic/PointMass";
import Vec2 from "../utils/math/Vector";
import { MouseButton } from "./Editor";
import EditorCreateMode from "./EditorCreateMode";

export default class EditorCreatePointMassMode extends EditorCreateMode {
    onClick(button: MouseButton, pos: Vec2): void {
		if (button === MouseButton.LEFT) {
			this.createPointMass(pos);
		}
    }

    createPointMass(pos: Vec2) {
		const pointmass = new PointMass({ position: pos });
    }

    onDrag(button: MouseButton, start: Vec2, end: Vec2): void {
        throw new Error("Method not implemented.");
    }

    onMouseMove(is_mouse_down: boolean, pos: Vec2): void {
        throw new Error("Method not implemented.");
    }

}
