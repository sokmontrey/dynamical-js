import PointMassInteractor from "../interactor/PointMassInteractor.ts";
import PointMassRenderer from "../body-renderer/PointMassRenderer.ts";
import Vec2 from "../utils/Vector.ts";
import PhysicBody, {PhysicBodyType} from "./PhysicBody.ts";
import { PhysicBodyProps } from "../core/PhysicBodyState.ts";

export interface PointMassProps extends PhysicBodyProps {
	position?: Vec2,
	velocity?: Vec2,
	constant_acceleration?: Vec2,
	initial_force?: Vec2,
	mass?: number,
	is_static?: boolean,
}

export default class PointMass implements PhysicBody {
	public readonly type = PhysicBodyType.POINT_MASS;

	private curr_pos: Vec2;
	private prev_pos: Vec2;
	private const_acc: Vec2;
	private net_force: Vec2;
	private mass: number;
	private is_static: boolean;

	public renderer: PointMassRenderer;
	public interactor: PointMassInteractor;

	constructor({
		position = Vec2.zero(),
		velocity = Vec2.zero(),
		mass = 1,
		is_static = false,
		constant_acceleration = Vec2.down(9.8),
		initial_force = Vec2.zero(),
	}: PointMassProps = {}) {
		this.curr_pos = position.copy();
		this.prev_pos = position.sub(velocity);
		this.mass = mass;
		this.is_static = is_static;
		this.net_force = initial_force.copy();
		this.const_acc = constant_acceleration.copy();

		this.renderer = new PointMassRenderer(this);
		this.interactor = new PointMassInteractor(this);
	}

	//================================ Getters ================================

	getTotalAcceleration() {
		return this.net_force
			.div(this.mass)			//	 net force / mass
			.add(this.const_acc);	// + constant acceleration
	}

	getPosition() {
		return this.curr_pos;
	}

	getPreviousPosition() {
		return this.prev_pos;
	}

	getVelocity() {
		return this.curr_pos.sub(this.prev_pos);
	}

	getMass() {
		return this.mass;
	}

	isStatic() {
		return this.is_static;
	}

	getNetForce() {
		return this.net_force;
	}

	getConstantAcceleration() {
		return this.const_acc;
	}

	getProps() {
		return {
			position: this.getPosition(),
			velocity: this.getVelocity(),
			constant_acceleration: this.getConstantAcceleration(),
			initial_force: this.getNetForce(),
			mass: this.getMass(),
			is_static: this.isStatic(),
		};
	}

	getType(): PhysicBodyType {
		return PhysicBodyType.POINT_MASS;
	}

	//================================ Setters ================================

	/**
	*	Turn pointmass into a static anchor. 
	*	Most of the methods will still has an effect on the pointmass except:
	*		`update`: has no effect even after the pointmass turned back to normal (using `disableStatic`).
	*		`setCurrentPosition`: has no effect even after the pointmass turned back to normal. Use `setPosition` instead to set position.
	**/
	enableStatic() {
		this.is_static = true;
		return this;
	}

	/**
	*	Turn pointmass back into a dynamic object.
	*	Action applied during the static phase will now be in effect (setVelocity, applyForce, etc.)
	**/
	disableStatic() {
		this.is_static = false;
		return this;
	}

	/**
	*	Constant acceleration. Does not get reset after every time step.
	*	Used for setting gravity, and etc.
	**/
	setConstantAcceleration(acceleration: Vec2) {
		this.const_acc = acceleration.copy();
		return this;
	}

	/**
	*	Add a force to the net force. 
	*	Unlike constant accelration, net force get reset
	*		after every update() call.
	*	Used for applying at a specific time step.
	**/
	applyForce(force: Vec2) {
		this.net_force = this.net_force.add(force);
		return this;
	}

	/**
	*	Move the pointmass to a specific coordinate 
	*	while reserving its velocity
	**/
	moveTo(position: Vec2){
		const vel = this.curr_pos.sub(this.prev_pos);
		this.curr_pos = position.copy();
		this.prev_pos = position.sub(vel);
	}

	/**
	*	Update current position and keep its previous position
	*		allowing the pointmass to response to the interaction automatically (position-based dynamic)
	*	Does not apply when the pointmass is static
	**/
	setCurrentPosition(position: Vec2) {
		if (this.is_static) return;
		this.curr_pos = position.copy();
		return this;
	}

	/**
	*	This library use previous position to keep track of velocity.
	*	velocity = current - previous position
	**/
	setPreviousPosition(previous_position: Vec2) {
		this.prev_pos = previous_position.copy();
		return this;
	}

	/**
	*	Update both current and previous position.
	*	The velocity become zero
	**/
	setPosition(position: Vec2) {
		this.curr_pos = position.copy();
		this.prev_pos = position.copy();
		return this;
	}

	/**
	*	Override previous position to assign new velocity to the pointmass
	**/
	setVelocity(velocity: Vec2) {
		this.prev_pos = this.curr_pos.sub(velocity);
		return this;
	}

	addVelocity(velocity: Vec2) {
		this.prev_pos = this.prev_pos.sub(velocity);
		return this;
	}

	resetVelocity() {
		this.prev_pos = this.curr_pos.copy();
		return this;
	}

	setMass(mass: number) {
		this.mass = mass;
		return this;
	}

	//================================ Dynamic ================================

	/**
	*	Update current position based on total accelration and previous position 
	*		enabling position-based dynamic (verlet integration).
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
		this.net_force = Vec2.zero();
		return this;
	}
}
