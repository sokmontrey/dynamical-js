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

	constructor(canvas: Canvas, {
		drag_threshold = 5,
	}: EditorParams = {}) {
		this.canvas = canvas;
		this.drag_threshold = drag_threshold;
		this.is_mouse_down = false;
		this.mouse_start_pos = Vec2.zero();
	}
}
