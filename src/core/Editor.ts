import Canvas from "./Canvas.ts";
import Vec2 from "../utils/Vector.ts";
import PhysicBodyManager from "../core-physic/PhysicBodyManager.ts";
import PhysicBody, { isFirstRankBody, isSecondRankBody } from "../core-physic/PhysicBody.ts";
import Loop from "./Loop.ts";
import ModeManager from "../mode/ModeManager.ts";
import PhysicBodyState from "./PhysicBodyState.ts";
import DependencyManager from "./DependencyManager.ts";
import PointMass from "../core-physic/PointMass.ts";
import RigidConstraint from "../core-physic/RigidConstraint.ts";

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
	private physic_state: PhysicBodyState;
	private loop: Loop;
	private body_manager!: PhysicBodyManager;
	private dependency_manager!: DependencyManager;
	private mode_manager: ModeManager;

	private base_canvas!: Canvas;
	private overlay_canvas!: Canvas;

	private drag_threshold: number;
	private is_mouse_down: boolean;
	private mouse_down_pos: Vec2;
	private holding_keys: Set<string>;

	constructor(canvas_container_id: string, state: PhysicBodyState, {
		drag_threshold = 5,
		sub_steps = 100,
		constant_dt = null,
	}: EditorParams = {}) {
		this.physic_state = state;
		this.drag_threshold = drag_threshold;
		this.holding_keys = new Set<string>();
		this.is_mouse_down = false;
		this.mouse_down_pos = Vec2.zero();
		this.loop = new Loop(
			this.updateLoop.bind(this),
			this.baseRenderingLoop.bind(this),
			{
				sub_steps,
				constant_dt
			});

		this.loadState(state);
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
		this.overlay_canvas.onMouseMove((_e: MouseEvent) => {
			this.mode_manager.onMouseMove();
		});

		this.overlay_canvas.onMouseDown((e: MouseEvent) => {
			if (this.is_mouse_down) return;
			this.is_mouse_down = true;
			this.mouse_down_pos = this.getMouseCurrentPosition();
			this.mode_manager.onMouseDown(e.button as MouseButton);
		});

		this.overlay_canvas.onMouseUp((e: MouseEvent) => {
			if (!this.is_mouse_down) return;
			this.is_mouse_down = false;
			this.mode_manager.onMouseUp(e.button as MouseButton);
			const diff = this.getMouseCurrentPosition().distance(this.mouse_down_pos);
			if (diff < this.drag_threshold) this.mode_manager.onMouseClick(e.button as MouseButton);
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

	stepBaseRenderer() {
		this.loop.render();
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

	getMouseCurrentPosition() {
		return this.overlay_canvas.getMousePosition();
	}

	getMouseDownPosition() {
		return this.mouse_down_pos;
	}

	getDragThreshold() {
		return this.drag_threshold;
	}

	isMouseDown() {
		return this.is_mouse_down;
	}

	isKeyDown(key: string) {
		return this.holding_keys.has(key);
	}

	getModeManager() {
		return this.mode_manager;
	}

	loadState(state: PhysicBodyState): Editor {
		// TODO: too many moving parts, need to refactor
		this.body_manager = PhysicBodyManager.fromState(state);
		this.dependency_manager = DependencyManager.fromState(state);
		return this;
	}

	reset() {
		this.loadState(this.physic_state);
		this.stepBaseRenderer();
		return this;
	}

	/**
	 * Save the current configuration of physic state.
	 * .reset() will then restore to this state.
	 */
	save(): PhysicBodyState {
		const new_state = this.body_manager.toState(this.dependency_manager);
		return this.physic_state = new_state;
	}

	createPointMass(position: Vec2) {
		const pointmass = new PointMass({ position });
		const name = this.body_manager.addBody(pointmass);
		this.dependency_manager.setDependency(name, {});
	}

	createRigidConstraint(pointmass1: PointMass, pointmass2: PointMass) {
		const rigid = new RigidConstraint(pointmass1, pointmass2);
		const name = this.body_manager.addBody(rigid);
		const pm1_name = this.body_manager.getName(pointmass1) || "";
		const pm2_name = this.body_manager.getName(pointmass2) || "";
		this.dependency_manager.setDependency(name, { pointmass1: pm1_name, pointmass2: pm2_name });
	}
}
