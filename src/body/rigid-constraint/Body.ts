import Body, { BodyType } from "../../core/Body";
import PointMass from "../point-mass/Body";
import RigidConstraint_Renderer, { RendererProps } from "./Renderer";

interface Props {
	is_broken: boolean;
}

export default class RigidConstraint extends Body<RigidConstraint, Props> {
	protected readonly moveable = false;
	protected readonly rank = 2;
	protected readonly type = BodyType.RIGID_CONSTRAINT;

	protected pointmass1: PointMass;
	protected pointmass2: PointMass;

	protected rest_distance: number = 0;
	protected diff: number = 0;
	protected corr: number = 0;

	constructor({
		pointmass1,
		pointmass2,
		props,
		renderer,
	}: {
		pointmass1: PointMass,
		pointmass2: PointMass,
		props: Props,
		renderer: RendererProps,
	}) {
		super();
		this.pointmass1 = pointmass1;
		this.pointmass2 = pointmass2;
		this.props = props;
		this.renderer = new RigidConstraint_Renderer(renderer);

		this.calculateRestDistance();
	}

	/**
	*	Check for differnece in current distance and rest distance 
	*		and immediately resolve the constraint by directly updating 
	*		the pointmasses position based on it relative weight to one another.
	*		TODO: create a correction build up mechanism for PointMass so that resolution 
	*			can be done after checking every constraint. 
	*			(temp_pos += corr_pos; count ++; temp_pos / corr_pos)
	**/
	update(dt: number) {
		this.triggerOnUpdate();
		if (this.isBroken()) return;
		this.check();
		this.resolve(dt); // Immediately resolve the constraint
	}

	//================================ Helpers ================================

	calculateRestDistance() {
		const pos1 = this.pointmass1.getPosition();
		const pos2 = this.pointmass2.getPosition();
		this.rest_distance = pos1.distance(pos2);
		this.diff = 0;
		this.corr = 0;
		if (this.rest_distance === 0)
			throw new Error("Rigid constraint cannot have rest distance = 0. Please use Hinge constraint instead.");
		return;
	}

	//================================ Getters ================================

	/**
	*	@return [pointmass1, pointmass2]
	**/
	getPointMasses() {
		return [this.pointmass1, this.pointmass2];
	}

	/**
	*	The difference between rest distance and current distance
	*		calculated after .update(dt)
	**/
	getDifference() {
		return this.diff;
	}

	/**
	*	Get the "Stress" value of a rigid constraint
	*		(I don't even know what exactly stress is)
	**/
	getStress() {
		return -this.diff / this.rest_distance;
	}

	getRestDistance() {
		return this.rest_distance;
	}

	getType(): BodyType {
		return BodyType.RIGID_CONSTRAINT;
	}

	isBroken(): boolean {
		return this.props.is_broken;
	}

	getCurrentDistance(): number {
		return this.pointmass1.getPosition().distance(this.pointmass2.getPosition());
	}

	//================================ Setters ================================

	/**
	*	Set pointmasses free from each other
	**/
	break() {
		this.setBroken(true);
	}

	setBroken(is_broken: boolean) {
		this.props.is_broken = is_broken;
	}

	/**
	*	Connect both pointmasses back together
	*	@param [recalculate_rest_distance=false] false by default. Recalculate rest distance (use current distance between pointmasses). 
	**/
	restore(recalculate_rest_distance: boolean = false) {
		this.setBroken(false);
		if (recalculate_rest_distance) this.calculateRestDistance();
	}

	setRestDistance(rest_distance: number, reset_pointmass_velocity: boolean = false) {
		this.rest_distance = rest_distance;
		if (reset_pointmass_velocity) {
			this.pointmass1.resetVelocity();
			this.pointmass2.resetVelocity();
		}
	}

	/**
	*	Check for the difference
	**/
	check() {
		const pos1 = this.pointmass1.getPosition();
		const pos2 = this.pointmass2.getPosition();
		const curr_distance = pos1.distance(pos2);
		this.diff = this.rest_distance - curr_distance;
	}

	calculateCorrection(_: number) {
		this.corr = this.diff / this.rest_distance;
	}

	resolve(dt: number) {
		if (this.isBroken()) return;
		if (this.getRestDistance() === 0)
			throw new Error("Rigid constraint cannot have rest distance = 0. Please use Hinge constraint instead.");
		const pos1 = this.pointmass1.getPosition();
		const pos2 = this.pointmass2.getPosition();
		if (Math.abs(this.diff) < 1e-9) return;

		this.calculateCorrection(dt);
		const v = pos2.sub(pos1);

		const mass1 = this.pointmass1.isStatic() ? 0 : 1 / this.pointmass1.getMass();
		const mass2 = this.pointmass2.isStatic() ? 0 : 1 / this.pointmass2.getMass();
		const total_mass = (mass1 + mass2);

		const new_pos1 = pos1.sub(v.mul(this.corr * mass1 / total_mass));
		const new_pos2 = pos2.add(v.mul(this.corr * mass2 / total_mass));

		if (!this.pointmass1.isStatic()) this.pointmass1.setCurrentPosition(new_pos1);
		if (!this.pointmass2.isStatic()) this.pointmass2.setCurrentPosition(new_pos2);
	}
}