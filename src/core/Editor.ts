import Canvas from "./Canvas.ts";
import Vec2 from "../utils/Vector.ts";

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
	private base_canvas!: Canvas;
	private overlay_canvas!: Canvas;

	private drag_threshold: number;
	private is_mouse_down: boolean;
	private mouse_start_pos: Vec2;

	constructor(canvas_container_id: string, {
		drag_threshold = 5,
	}: EditorParams = {}) {
		this.drag_threshold = drag_threshold;
		this.is_mouse_down = false;
		this.mouse_start_pos = Vec2.zero();
		this.setupCanvas(canvas_container_id);
		this.setupMouseEvent();
	}

	private setupCanvas(canvas_container_id: string) {
		const base_canvas_ele = document.createElement('canvas');
		const overlay_canvas_ele = document.createElement('canvas');

		this.base_canvas = new Canvas(base_canvas_ele).disableMouseEvent();
		this.overlay_canvas = new Canvas(overlay_canvas_ele).addMousePositionEvent();

		const container = document.getElementById(canvas_container_id);
		if (!container) throw new Error("No container found for canvas");
		container.appendChild(base_canvas_ele);
		container.appendChild(overlay_canvas_ele);
	}

	setupMouseEvent() {
		this.overlay_canvas.onMouseMove((_: MouseEvent) => {
			this.overlay_canvas.clear();
		});

		this.overlay_canvas.onMouseDown((_: MouseEvent) => {
			if (this.is_mouse_down) return;
			this.is_mouse_down = true;
			this.mouse_start_pos = this.overlay_canvas.getMousePosition();
		});

		this.overlay_canvas.onMouseUp((e: MouseEvent) => {
			if (!this.is_mouse_down) return;
			this.is_mouse_down = false;
			const mouse_curr_pos = this.overlay_canvas.getMousePosition();
			const diff = mouse_curr_pos.sub(this.mouse_start_pos).mag();
			if (diff < this.drag_threshold) this.onClick(e.button, this.mouse_start_pos);
			else this.onDrag(e.button, this.mouse_start_pos, mouse_curr_pos);
		});
	}

	onClick(button: MouseButton, pos: Vec2) {
	}

	onDrag(button: MouseButton, start: Vec2, end: Vec2) {
	}
}
