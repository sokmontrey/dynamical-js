import Canvas from "./Canvas.ts";
import Vec2 from "../utils/Vector.ts";
import PhysicBodyManager from "../core-physic/PhysicBodyManager.ts";
import PhysicBody, { isFirstRankBody, isSecondRankBody } from "../core-physic/PhysicBody.ts";
import Loop from "./Loop.ts";
import ModeManager from "../mode/ModeManager.ts";

export interface EditorParams {
	/**
	* How far (pixels) the mouse need to move to activate dragging
	**/
	drag_threshold?: number;
	sub_steps?: number;
	constant_dt?: number | null;
}

export enum MouseButton {
	LEFT = 0,
	MIDDLE = 1,
	RIGHT = 2,
}

export default class Editor {
	private loop: Loop;
	private body_manager: PhysicBodyManager;
	private mode_manager: ModeManager;

	private base_canvas!: Canvas;
	private overlay_canvas!: Canvas;

	private drag_threshold: number;
	private is_mouse_down: boolean;
	private mouse_start_pos: Vec2;
	private mouse_curr_pos: Vec2;
	private holding_keys: Set<string>;

	constructor(canvas_container_id: string, {
		drag_threshold = 5,
		sub_steps = 100,
		constant_dt = null,
	}: EditorParams = {}) {
		this.drag_threshold = drag_threshold;
		this.is_mouse_down = false;
		this.mouse_start_pos = Vec2.zero();
		this.mouse_curr_pos = Vec2.zero();
		this.holding_keys = new Set<string>();
		this.loop = new Loop(this.updateLoop.bind(this),
			this.baseRenderingLoop.bind(this), { sub_steps, constant_dt });

		this.body_manager = new PhysicBodyManager();
		this.mode_manager = new ModeManager(this);

		this.setupCanvas(canvas_container_id);
		this.setupMouseEvents();
		this.setupKeyboardEvent();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private updateLoop(dt: number, _sub_steps: number) {
		this.body_manager
			.getAllBodies()
			.filter(isFirstRankBody)
			.forEach(x => x.update(dt));

		this.body_manager
			.getAllBodies()
			.filter(isSecondRankBody)
			.forEach(x => x.update(dt));
	}

	private baseRenderingLoop(_dt: number, _sub_steps: number) {
		this.base_canvas.clear();
		this.body_manager
			.getAllBodies()
			.forEach(body =>
				body.renderer.draw(this.base_canvas.getContext(), _sub_steps));
	}

	private setupCanvas(canvas_container_id: string) {
		const container = document.getElementById(canvas_container_id);
		if (!container) throw new Error("No container found for canvas");

		// create two canvas elements
		const base_canvas_ele = document.createElement('canvas');
		const overlay_canvas_ele = document.createElement('canvas');
		container.appendChild(base_canvas_ele);
		container.appendChild(overlay_canvas_ele);

		// setting up the overlay canvas
		container.style.position = "relative";
		base_canvas_ele.style.position = overlay_canvas_ele.style.position = "absolute";
		base_canvas_ele.style.top = overlay_canvas_ele.style.top = "0";
		base_canvas_ele.style.left = overlay_canvas_ele.style.left = "0";
		base_canvas_ele.style.zIndex = "0";
		overlay_canvas_ele.style.zIndex = "1";

		// setting up the canvas size + create the canvas object
		const { clientWidth: width, clientHeight: height } = container;
		this.base_canvas = new Canvas(base_canvas_ele, {width, height}).disableMouseEvent();
		this.overlay_canvas = new Canvas(overlay_canvas_ele, {width, height}).addMousePositionEvent();
	}

	setupMouseEvents() {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.overlay_canvas.onMouseMove((_: MouseEvent) => {
			this.mode_manager.onMouseMove();
			if (!this.is_mouse_down) return;
			this.mouse_curr_pos = this.overlay_canvas.getMousePosition();
			const diff = this.mouse_curr_pos.distance(this.mouse_start_pos);
			if (diff < this.drag_threshold) return;
			this.mode_manager.onMouseDragging(
				e.button as MouseButton,
				this.mouse_start_pos,
				this.mouse_curr_pos);
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.overlay_canvas.onMouseDown((_: MouseEvent) => {
			if (this.is_mouse_down) return;
			this.is_mouse_down = true;
			this.mouse_start_pos = this.overlay_canvas.getMousePosition();
			this.mode_manager.onMouseDown();
		});

		this.overlay_canvas.onMouseUp((e: MouseEvent) => {
			if (!this.is_mouse_down) return;
			this.is_mouse_down = false;
			const diff = this.mouse_curr_pos.distance(this.mouse_start_pos);
			if (diff < this.drag_threshold)
				this.mode_manager.onMouseClick(
					e.button as MouseButton,
					this.mouse_start_pos);
			this.mode_manager.onMouseUp();
		});
	}

	setupKeyboardEvent() {
		document.addEventListener('keydown', (e) => {
			this.holding_keys.add(e.key);
		});

		document.addEventListener('keyup', (e) => {
			this.holding_keys.delete(e.key);
		});
	}

	addBody(body: PhysicBody) {
		this.body_manager.addBody(body);
		return this;
	}

	start() {
		this.loop.run();
		return this;
	}

	pause() {
		this.loop.pause();
		return this;
	}

	getPhysicBodyManager() {
		return this.body_manager;
	}

	getOverlayCanvas() {
		return this.overlay_canvas;
	}

	isKeyDown(key: string) {
		return this.holding_keys.has(key);
	}
}
