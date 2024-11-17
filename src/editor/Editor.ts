import Canvas from "../core/Canvas";
import EditorRenderer from "../renderer/EditorRenderer";
import Vec2 from "../utils/math/Vector";

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
	}

	onDrag(button: MouseButton, start: Vec2, end: Vec2) {
		const lower = Vec2.min(start, end);
		const upper = Vec2.max(start, end);
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
