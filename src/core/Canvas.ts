export interface CanvasParams {
	width?: number;
	height?: number;
}

export default class Canvas {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;

	constructor(
		canvas: HTMLCanvasElement,
		{
			width = window.innerWidth,
			height = window.innerHeight,
		}: CanvasParams = {}
	) {

		this.canvas = canvas;
		this.width = width;
		this.height = height;
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error("Unable to get 2D context from canvas");
		this.ctx = ctx;
		this.ctx.translate(width / 2.0, height / 2.0);
	}

	clear() {
		if (!this.ctx) return this;
		this.ctx.clearRect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height);
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
}
