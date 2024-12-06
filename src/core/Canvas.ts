import Vec2, { vec2 } from "../utils/Vector.ts";

export interface CanvasParams {
	width?: number;
	height?: number;
}

export type EventCallBack = (e: MouseEvent) => void;

export default class Canvas {
	private canvas: HTMLCanvasElement;
	private ctx!: CanvasRenderingContext2D;
	private width: number;
	private height: number;

	private offset: Vec2;
	private mouse_pos: Vec2;

	constructor(canvas: HTMLCanvasElement, {
		width = window.innerWidth,
		height = window.innerHeight,
	}: CanvasParams = {}) {
		this.canvas = canvas;

		this.width = width;
		this.height = height;
		this.mouse_pos = Vec2.zero();
		this.offset = vec2(width / 2.0, height / 2.0);

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error("Unable to get 2D context from canvas");
		this.ctx = ctx;
		this.ctx.translate(this.offset.x, this.offset.y);
	}

	disableMouseEvent() {
        this.canvas.style.pointerEvents = "none";
		return this;
	}

	addMousePositionEvent() {
		this.onMouseMove((e: MouseEvent) => {
			const rect = this.canvas.getBoundingClientRect();
			const raw_x = (e.clientX - rect.left) * (this.width / rect.width);
			const raw_y = (e.clientY - rect.top) * (this.height / rect.height);
			const transform = this.ctx.getTransform();
			const inv_scaled_x = 1 / transform.a;
			const inv_scaled_y = 1 / transform.d;
			const inv_translated_x = -transform.e * inv_scaled_x;
			const inv_translated_y = -transform.f * inv_scaled_y;
			const adjusted_x = (raw_x + inv_translated_x) * inv_scaled_x;
			const adjusted_y = (raw_y + inv_translated_y) * inv_scaled_y;
			this.mouse_pos = vec2(adjusted_x, adjusted_y);
		});
		return this;
	}

	clear() {
		this.ctx.clearRect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height);
	}

	onMouseMove(callback: EventCallBack) {
		this.canvas.addEventListener('mousemove', callback);
	}

	onMouseClick(callback: EventCallBack) {
		this.canvas.addEventListener('click', callback);
	}

	onMouseDown(callback: EventCallBack) {
		this.canvas.addEventListener('mousedown', callback);
	}

	onMouseUp(callback: EventCallBack) {
		this.canvas.addEventListener('mouseup', callback);
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getCanvas() {
		return this.canvas;
	}

	getContext() {
		return this.ctx;
	}

	getMousePosition() {
		return this.mouse_pos;
	}
}
