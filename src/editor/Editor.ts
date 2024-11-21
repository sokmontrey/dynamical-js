import PhysicBody, { PhysicBodyType } from "../core-physic/PhysicBody";
import PointMass from "../core-physic/PointMass";
import Canvas from "../core/Canvas";
import SpatialQuery from "../core/SpatialQuery";
import Vec2 from "../utils/math/Vector";
import EditorCreatePointMassMode from "./EditorCreatePointMassMode";
import EditorCreateRigidConstraintMode from "./EditorCreateRigidConstraintMode";
import EditorMode from "./EditorMode";

export interface EditorParams {
	/**
	* How far (pixels) the mouse need to move to activate dragging
	**/
	drag_threshold?: number;
}

export enum MouseButton {
	LEFT = 0,
	MIDDLE = 1,
	RIGHT = 2, 
}

export default class Editor {
	private canvas: Canvas;
	private drag_threshold: number;

	private spatial_query: SpatialQuery;
	private editor_mode: EditorMode;

	private is_mouse_down: boolean;
	private mouse_start_pos: Vec2;

	constructor(canvas: Canvas, {
		drag_threshold = 5,
	}: EditorParams = {}) {
		this.canvas = canvas;
		this.drag_threshold = drag_threshold;

		this.is_mouse_down = false;
		this.mouse_start_pos = Vec2.zero();

		this.spatial_query = new SpatialQuery(canvas.getWidth(), canvas.getHeight());
		this.editor_mode = new EditorCreatePointMassMode(this);
		this.setupMouseEvent();
	}

	setupMouseEvent() {
		this.canvas.onMouseMove((_: MouseEvent) => {
			this.editor_mode.onMouseMove(this.is_mouse_down, this.canvas.getMousePosition());
		});

		this.canvas.onMouseDown((_: MouseEvent) => {
			if (this.is_mouse_down) return;
			this.is_mouse_down = true;
			this.mouse_start_pos = this.canvas.getMousePosition();
		});

		this.canvas.onMouseUp((e: MouseEvent) => {
			if (!this.is_mouse_down) return;
			this.is_mouse_down = false;
			const mouse_curr_pos = this.canvas.getMousePosition();
			const diff = mouse_curr_pos.sub(this.mouse_start_pos).mag();
			if (diff < this.drag_threshold) this.onClick(e.button, this.mouse_start_pos);
			else this.onDrag(e.button, this.mouse_start_pos, mouse_curr_pos);
		});
	}

	onClick(button: MouseButton, pos: Vec2) {
		this.editor_mode.onClick(button, pos);
	}

	onDrag(button: MouseButton, start: Vec2, end: Vec2) {
		this.editor_mode.onDrag(button, start, end);
	}

	isDragging() {
		if (!this.is_mouse_down) return;
		const mouse_curr_pos = this.canvas.getMousePosition();
		const diff = mouse_curr_pos.sub(this.mouse_start_pos).mag();
		return diff >= this.drag_threshold;
	}

	getMouseStartPosition() {
		return this.mouse_start_pos;
	}

	getMouseCurrentPosition() {
		return this.canvas.getMousePosition();
	}

	selectPhysicBodies(lower: Vec2, upper: Vec2): PhysicBody[] | null {
		// Use spatial data structure to return physic bodies in a selected region
		return null;
	}

	pickPointMass(pos: Vec2): PhysicBody | null {
		this.spatial_query.pickPointMass(pos)[0];
		return null;
	}

    addPointMass(pointmass: PointMass): void {
		this.spatial_query.addPointMass(pointmass);
		return;
    }

	//================================ State methods ================================

	toCreateMode(body_type: PhysicBodyType) {
		switch (body_type) {
			case PhysicBodyType.POINTMASS:
				this.editor_mode = new EditorCreatePointMassMode(this);
				break;
			case PhysicBodyType.RIGID_CONSTRAINT:
				this.editor_mode = new EditorCreateRigidConstraintMode(this);
				break;
		}
	}

    toMoveMode() {
        throw new Error("Method not implemented.");
    }
}
