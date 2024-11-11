import EditorRenderer from "../renderer/EditorRenderer";
import Vec2 from "../utils/math/Vector";
import Canvas from "./Canvas";

export interface EditorParams {
	/**
	* How far (pixels) the move need to move to activate dragging
	**/
	drag_threshold?: number;
}

export default class Editor {
	private canvas: Canvas;
	private drag_threshold: number;
	private is_mouse_down: boolean;
	private mouse_start_pos: Vec2;

	public readonly renderer: EditorRenderer;

	constructor(canvas: Canvas, {
		drag_threshold = 5,
	}: EditorParams = {}) {
		this.canvas = canvas;
		this.drag_threshold = drag_threshold;
		this.is_mouse_down = false;
		this.mouse_start_pos = Vec2.zero();
		this.setupMouseEvent();
		this.renderer = new EditorRenderer(this);
	}

	setupMouseEvent() {
		this.canvas.onMouseDown((_: MouseEvent) => {
			if (this.is_mouse_down) return;
			this.is_mouse_down = true;
			this.mouse_start_pos = this.canvas.getMousePosition();
		});

		this.canvas.onMouseUp((_: MouseEvent) => {
			if (!this.is_mouse_down) return;
			this.is_mouse_down = false;
			const mouse_curr_pos = this.canvas.getMousePosition();
			const diff = mouse_curr_pos.sub(this.mouse_start_pos).mag();
			if (diff < this.drag_threshold) this.click(this.mouse_start_pos);
			else this.drag(this.mouse_start_pos, mouse_curr_pos);
		});
	}

	click(pos: Vec2) {
		console.log("Click", pos);
	}

	drag(start: Vec2, end: Vec2) {
		console.log("Drag", start, end);
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
}
