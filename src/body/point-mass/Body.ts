import Body, { BodyType } from "../../core/Body";
import Vec2 from "../../utils/Vector";
import PointMass_Renderer, { RendererProps } from "./Renderer";

interface PointMass_Props {
	position: Vec2,
	previous_position: Vec2,
	constant_acceleration: Vec2,
	net_force: Vec2,
	mass: number,
	is_static: boolean,
}

export default class PointMass extends Body<PointMass, PointMass_Props> {
	protected readonly rank = 1;
	protected readonly type = BodyType.POINT_MASS;
	protected readonly moveable = true;

	constructor({
		props, 
		renderer
	}: {
		props: PointMass_Props, 
		renderer: RendererProps
	}) {
		super();
		this.props = props;
		this.renderer = new PointMass_Renderer(renderer);
	}

	//================================ Dynamic ================================

	/**
	*	Update current position based on total accelration and previous position 
	*		enabling position-based dynamic (verlet integration).
	**/
	update(delta_time: number): void {
		if (this.isStatic()) return;
		const acc = this.getTotalAcceleration();
		const vel = this.props.position
			.sub(this.props.previous_position)
			.div(delta_time)
			.add(acc.mul(delta_time));
		this.props.previous_position = this.props.position.copy();
		this.props.position = this.props.position.add(vel.mul(delta_time));
		this.props.net_force = Vec2.zero();
		this.triggerOnUpdate();
	}

	//================================ Getters ================================

	getTotalAcceleration() {
		return this.props.net_force
			.div(this.props.mass)			//	 net force / mass
			.add(this.props.constant_acceleration);	// + constant acceleration
	}

	getPosition() {
		return this.props.position;
	}

	getPreviousPosition() {
		return this.props.previous_position;
	}

	getVelocity() {
		return this.props.position.sub(this.props.previous_position);
	}

	getMass() {
		return this.props.mass;
	}

	isStatic() {
		return this.props.is_static;
	}

	getNetForce() {
		return this.props.net_force;
	}

	getConstantAcceleration() {
		return this.props.constant_acceleration;
	}

	getType(): BodyType {
		return BodyType.POINT_MASS;
	}

	//================================ Setters ================================

	/**
	*	Turn pointmass into a static anchor. 
	*	Most of the methods will still has an effect on the pointmass except:
	*		`update`: has no effect even after the pointmass turned back to normal (using `disableStatic`).
	*		`setCurrentPosition`: has no effect even after the pointmass turned back to normal. Use `setPosition` instead to set position.
	**/
	enableStatic() {
		this.setStatic(true);
	}

	/**
	*	Turn pointmass back into a dynamic object.
	*	Action applied during the static phase will now be in effect (setVelocity, applyForce, etc.)
	**/
	disableStatic() {
		this.setStatic(false);
	}

	/**
	*	Constant acceleration. Does not get reset after every time step.
	*	Used for setting gravity, and etc.
	**/
	setConstantAcceleration(acceleration: Vec2) {
		this.props.constant_acceleration = acceleration.copy();
	}

	/**
	*	Add a force to the net force. 
	*	Unlike constant accelration, net force get reset
	*		after every update() call.
	*	Used for applying at a specific time step.
	**/
	applyForce(force: Vec2) {
		this.props.net_force = this.props.net_force.add(force);
	}

	/**
	*	Move the pointmass to a specific coordinate 
	*	while reserving its velocity
	**/
	moveTo(position: Vec2){
		const vel = this.props.position.sub(this.props.previous_position);
		this.props.position = position.copy();
		this.props.previous_position = position.sub(vel);
		this.triggerOnUpdate();
	}

	/**
	*	Update current position and keep its previous position
	*		allowing the pointmass to response to the interaction automatically (position-based dynamic)
	*	Does not apply when the pointmass is static
	**/
	setCurrentPosition(position: Vec2) {
		if (this.isStatic()) return;
		this.props.position = position.copy();
	}

	/**
	*	This library use previous position to keep track of velocity.
	*	velocity = current - previous position
	**/
	setPreviousPosition(previous_position: Vec2) {
		this.props.previous_position = previous_position.copy();
	}

	/**
	*	Update both current and previous position.
	*	The velocity become zero
	**/
	setPosition(position: Vec2) {
		this.props.position = position.copy();
		this.props.previous_position = position.copy();
	}

	/**
	*	Override previous position to assign new velocity to the pointmass
	**/
	setVelocity(velocity: Vec2) {
		this.props.previous_position = this.props.position.sub(velocity);
	}

	addVelocity(velocity: Vec2) {
		this.props.previous_position = this.props.previous_position.sub(velocity);
	}

	resetVelocity() {
		this.props.previous_position = this.props.position.copy();
	}

	setMass(mass: number) {
		this.props.mass = mass;
	}

	setStatic(is_static: boolean) {
		this.props.is_static = is_static;
	}
}
