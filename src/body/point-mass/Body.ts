import Body, { BodyType } from "../../core/Body";
import { PropBinder, useInputPropBinder } from "../../hooks/usePropBinder";
import BodyManager from "../../manager/BodyManager";
import LoopManager from "../../manager/LoopManager";
import BooleanInput from "../../ui-components/input/BooleanInput";
import NumberInput from "../../ui-components/input/NumberInput";
import VectorInput from "../../ui-components/input/VectorInput";
import Color from "../../utils/Color";
import Vec2, { vec2 } from "../../utils/Vector";
import PointMass_Interactor from "./Interactor";
import PointMass_Renderer, { PointMass_RendererProps } from "./Renderer";

export interface PointMass_Props {
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

	protected props: PointMass_Props;
	public renderer: PointMass_Renderer;
	public interactor: PointMass_Interactor;

	constructor({
		props = {},
		renderer = {},
	}: {
		props?: Partial<PointMass_Props>, 
		renderer?: PointMass_RendererProps
	}) {
		super();
		this.props = {
			position: props.position || vec2(0, 0),
			previous_position: props.previous_position || props.position || vec2(0, 0),
			constant_acceleration: props.constant_acceleration || vec2(0, 9.8),
			net_force: props.net_force || vec2(0, 0),
			mass: props.mass || 1,
			is_static: props.is_static || false,
		};
		this.renderer = new PointMass_Renderer(renderer);
		this.interactor = new PointMass_Interactor(this);
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

	getPropBinders(): PropBinder<any>[] {
        return [
            // static
            useInputPropBinder(BooleanInput, 
                { label: "Static" },
                () => this.isStatic(),
                (value: boolean) => this.setStatic(value)),

            // position
            useInputPropBinder(VectorInput, 
                { label: "Position", step: 10 },
                () => this.getPosition(),
                (value: Vec2) => {
                    this.setPosition(value);
                    if (!LoopManager.isRunning()) {
                        BodyManager.updateConnectedConstraints(this);
                    }
                }),

            // velocity
            useInputPropBinder(VectorInput, 
                { label: "Velocity", step: 0.01 },
                () => this.getVelocity(),
                (value: Vec2) => this.setVelocity(value)),

            // constant acceleration
            useInputPropBinder(VectorInput, 
                { label: "Acceleration", step: 0.1 },
                () => this.getConstantAcceleration(),
                (value: Vec2) => this.setConstantAcceleration(value)),

            // mass
            useInputPropBinder(NumberInput, 
                { label: "Mass", min: 0.01, step: 1 },
                () => this.getMass(),
                (value: number) => this.setMass(value)),
        ];
	}

	//================================ Getters ================================

	getDependencies(): string[] {
		return [];
	}

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

	//================================ Serialization ================================

	toJSON(): any {
		return {
			...super.toJSON(),
			props: this.props,
			renderer: this.renderer.toJSON(),
		};
	}
}
