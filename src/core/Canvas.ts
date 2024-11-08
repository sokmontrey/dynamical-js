export interface CanvasParams {
	width?: number;
	height?: number;
}

export default class Canvas {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D | null;
	private width: number;
	private height: number;

	constructor(
		canvas: HTMLCanvasElement,
		{
			width = 500,
			height = 500,
		}: CanvasParams = {}) {

		this.canvas = canvas;
		this.width = width;
		this.height = height;
		canvas.width = width;
		canvas.height = height;
		this.ctx = canvas.getContext('2d');
		this.ctx?.translate(width / 2.0, height / 2.0);
	}

	clear() {
		if (!this.ctx) return this;
		this.ctx.clearRect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height);
	}

	getContext() { 
		return this.ctx; 
	}
}
