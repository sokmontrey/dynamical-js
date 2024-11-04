import Vec2 from "../utils/math/Vector.ts";

export interface PointMassParams {
	position?: Vec2,
	velocity?: Vec2,
	constant_acceleration?: Vec2,
	initial_force?: Vec2,
	mass?: number,
	is_static?: boolean,
};

export default class PointMass {
	private curr_pos: Vec2;
	private prev_pos: Vec2;
	private const_acc: Vec2;
	private net_force: Vec2;
	private mass: number;
	private is_static: boolean;

	constructor({
		position = Vec2.zero(),
		velocity = Vec2.zero(),
		mass = 1,
		is_static = false,
		constant_acceleration= Vec2.zero(),
		initial_force = Vec2.zero(),
	}: PointMassParams = {}) {

		this.curr_pos = position;
		this.prev_pos = position.sub(velocity);
		this.mass = mass;
		this.is_static = is_static;
		this.net_force = initial_force;
		this.const_acc = constant_acceleration;
	}

	getTotalAcceleration() {
		return this.net_force
			.div(this.mass)			//	 net force / mass
			.add(this.const_acc);	// + constant acceleration
	}

	enableStatic() { this.is_static = true; return this; }
	disableStatic() { this.is_static = false; return this; }

	applyForce(force: Vec2) {
		this.net_force = this.net_force.add(force);
		return this;
	}

}
