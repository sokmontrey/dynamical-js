export interface LoopParams {
	constant_dt?: number | null,
	sub_steps?: number,
}

export type update_func = (dt: number) => {}

export default class Loop {
	private is_constant_dt: boolean;
	private constant_dt: number;

	private prev_time: number;
	private update_func: update_func;
	private frame_id: number | null;
	private frame_count: number;

	constructor(update_func: update_func, {
		constant_dt = null,
	}: LoopParams = {}) {
		this.update_func = update_func;

		this.is_constant_dt = false;
		this.constant_dt = 0.16;
		if (constant_dt !== null) {
			if (constant_dt <= 0) throw new Error("Constant delta time cannot be less than or equal to zero");
			this.is_constant_dt = true;
			this.constant_dt = constant_dt;
		}

		this.prev_time = 0;
		this.frame_id = null;
		this.frame_count = 0;
	}

	private getDeltaTime(current_time: number) {
		if (this.is_constant_dt) return this.constant_dt;
		const dt = Math.min((current_time - this.prev_time) / 10, 0.16);
		this.prev_time = current_time;
		return dt;
	}

	_update(current_time: number) {
		const dt = this.getDeltaTime(current_time);
		this.frame_count++;
		this.update_func(dt);
		this.frame_id = window.requestAnimationFrame(this._update);
	}

	run(): number {
		this.frame_id = window.requestAnimationFrame(this._update);
		return this.frame_id;
	}

	pause() {
		if (this.frame_id === null) return;
		window.cancelAnimationFrame(this.frame_id);
	}

	restart() {
		this.frame_count = 0;
	}

	step(dt: number = 0.16) {
		if (dt <= 0) throw new Error("Delta time cannot be less than or equal to zero");
		this.frame_count ++;
		this.update_func(dt);
	}
}
