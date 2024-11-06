import PointMassRenderer from "../renderer/PointMassRenderer.ts";
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

	public readonly renderer: PointMassRenderer;

	constructor({
		position = Vec2.zero(),
		velocity = Vec2.zero(),
		mass = 1,
		is_static = false,
		constant_acceleration = Vec2.zero(),
		initial_force = Vec2.zero(),
	}: PointMassParams = {}) {
		this.curr_pos = position;
		this.prev_pos = position.sub(velocity);
		this.mass = mass;
		this.is_static = is_static;
		this.net_force = initial_force;
		this.const_acc = constant_acceleration;

		this.renderer = new PointMassRenderer(this);
	}

	// ------------------------------ getters ------------------------------

	getTotalAcceleration() {
		return this.net_force
			.div(this.mass)			//	 net force / mass
			.add(this.const_acc);	// + constant acceleration
	}
	getPosition() { return this.curr_pos; }
	getPreviousPosition() { return this.prev_pos; }
	getVelocity() { return this.curr_pos.sub(this.prev_pos); }
	getMass() { return this.mass; }
	isStatic() { return this.is_static; }
	getNetForce() { return this.net_force; }
	getConstantAcceleration() { return this.const_acc; }

	// ------------------------------ setters ------------------------------

	enableStatic() { this.is_static = true; return this; }
	disableStatic() { this.is_static = false; return this; }

	applyForce(force: Vec2) {
		this.net_force = this.net_force.add(force);
		return this;
	}

	setConstantAcceleration(acceleration: Vec2) {
		this.const_acc = acceleration;
		return this;
	}

	/**
	*	Move the pointmass to a specific coordinate 
	*	while reserving its velocity
	**/
	changePosition(position: Vec2) {
		const vel = this.curr_pos.sub(this.prev_pos);
		this.curr_pos = position;
		this.prev_pos = position.sub(vel);
		return this;
	}

	/**
	*	Update current position and keep its previous position
	*	allowing the pointmass to response to the interaction (position-based dynamic)
	**/
	setCurrentPosition(position: Vec2) {
		this.curr_pos = position;
		return this;
	}

	setPreviousPosition(previous_position: Vec2) {
		this.prev_pos = previous_position;
		return this;
	}
 
	/**
	*	Update both current and previous position.
	*	The velocity become zero
	**/
	setPosition(position: Vec2) {
		this.curr_pos = position;
		this.prev_pos = position;
		return this;
	}
 
	setVelocity(velocity: Vec2) {
		this.prev_pos = this.curr_pos.sub(velocity);
		return this;
	}

	/**
	*	Position-based dynamic (verlet integration)
	**/
	update(delta_time: number) {
		if (this.is_static) return this;
		const acc = this.getTotalAcceleration();
		const vel = this.curr_pos
			.sub(this.prev_pos)
			.div(delta_time)
			.add(acc.mul(delta_time));
		this.prev_pos = this.curr_pos.copy();
		this.curr_pos = this.curr_pos.add(vel.mul(delta_time));
		return this;
	}
}
