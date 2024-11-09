export interface LoopParams {
	constant_dt?: number | null,
	sub_steps?: number,
}

export type update_func = (dt: number, steps: number) => {}

export default class Loop {
	private is_constant_dt: boolean;
	private constant_dt: number; 
	private sub_steps: number;
	private update_func: update_func;

	constructor(update_func: update_func, {
		constant_dt = null,
		sub_steps = 1,
	}: LoopParams = {}) {
		this.update_func = update_func;
		this.is_constant_dt = constant_dt !== null;
		this.constant_dt = constant_dt ?? 0.016;
		this.sub_steps = sub_steps;
	}

	run() {

	}

	pause() {

	}

	stop() {

	}

	restart() {

	}

	step(step_size: number) {

	}
}
