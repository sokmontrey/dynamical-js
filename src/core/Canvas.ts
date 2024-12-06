import Vec2, { vec2 } from "../utils/Vector.ts";

export interface CanvasParams {
	width?: number;
	height?: number;
}

export type EventCallBack = (e: MouseEvent) => void;

export default class Canvas {
	public static instance: Canvas;

	private canvas: HTMLCanvasElement;
	private overlay_canvas!: HTMLCanvasElement;
	private ctx!: CanvasRenderingContext2D;
	private overlay_ctx!: CanvasRenderingContext2D;
	private width: number;
	private height: number;

	private offset: Vec2;
	private mouse_pos: Vec2;

	getInstance() {
		if (!Canvas.instance) {
			throw new Error("Canvas instance is not created");
		}
		return Canvas.instance;
	}

	static create(canvas: HTMLCanvasElement, params?: CanvasParams) {
		if (Canvas.instance) {
			throw new Error("Canvas instance is already created");
		}
		Canvas.instance = new Canvas(canvas, params);
		return Canvas.instance;
	}

	private constructor(canvas: HTMLCanvasElement, {
		width = window.innerWidth,
		height = window.innerHeight,
	}: CanvasParams = {}) {
		this.width = width;
		this.height = height;
		this.mouse_pos = Vec2.zero();
		this.offset = vec2(width / 2.0, height / 2.0);

		this.canvas = canvas;
        this.overlay_canvas = document.createElement("canvas");

		this.setupCanvasSize();
		this.setupOverlay();
		this.setupZIndex();
		this.createContext();
		this.applyOffset();
		this.addMousePositionEvent();
	}

	private setupCanvasSize() {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
        this.overlay_canvas.width = this.width;
        this.overlay_canvas.height = this.height;
	}

	private applyOffset() {
		this.ctx.translate(this.offset.x, this.offset.y);
		this.overlay_ctx.translate(this.offset.x, this.offset.y);
	}

	private setupZIndex() {
		const z = parseInt(this.canvas.style.zIndex) || 0;
		this.canvas.style.zIndex = z.toString();
		this.overlay_canvas.style.zIndex = (z + 1).toString();
	}

	private createContext() {
		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error("Unable to get 2D context from canvas");
		this.ctx = ctx;

		const overlay_ctx = this.overlay_canvas.getContext("2d"); 
		if(!overlay_ctx) throw new Error("Unable to get 2D context from overlaying canvas");
        this.overlay_ctx = overlay_ctx;
	}

	private setupOverlay() {
        this.overlay_canvas.style.position = "absolute";
        this.overlay_canvas.style.top = `${this.canvas.offsetTop}px`;
        this.overlay_canvas.style.left = `${this.canvas.offsetLeft}px`;
        this.canvas.style.pointerEvents = "none"; // Prevent interference with original canvas
        this.canvas.parentElement!.appendChild(this.overlay_canvas);
	}

	private addMousePositionEvent() {
		this.onMouseMove((e: MouseEvent) => {
			const rect = this.overlay_canvas.getBoundingClientRect();
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
	}

	clear() {
		this.ctx.clearRect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height);
	}

	clearOverlay() {
		this.overlay_ctx.clearRect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height);
	}

	onMouseMove(callback: EventCallBack) {
		this.overlay_canvas.addEventListener('mousemove', callback);
	}

	onMouseClick(callback: EventCallBack) {
		this.overlay_canvas.addEventListener('click', callback);
	}

	onMouseDown(callback: EventCallBack) {
		this.overlay_canvas.addEventListener('mousedown', callback);
	}

	onMouseUp(callback: EventCallBack) {
		this.overlay_canvas.addEventListener('mouseup', callback);
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

	getOverlayCanvas() {
		return this.overlay_canvas;
	}

	getContext() {
		return this.ctx;
	}

	getOverlayContext() {
		return this.overlay_ctx;
	}

	getMousePosition() {
		return this.mouse_pos;
	}
}
