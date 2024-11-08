import RigidConstraintRenderer from "../renderer/RigidConstraintRenderer";
import PointMass from "./PointMass";

export interface RigidConstraintParams { };
export interface RigidConstraintParams { 
	is_broken?: boolean;
};

export default class RigidConstraint {
	protected pm1: PointMass;
	protected pm2: PointMass;
	protected is_broken: boolean;

	protected rest_distance: number = 0;
	protected diff: number;
	protected corr: number;

	public readonly renderer: RigidConstraintRenderer;

	constructor(pointmass1: PointMass, pointmass2: PointMass, {
		is_broken = false,
	}: RigidConstraintParams = {}) {

		this.pm1 = pointmass1;
		this.pm2 = pointmass2;
		this.is_broken = is_broken;
		this.calculateRestDistance();
		this.diff = 0;
		this.corr = 0;

		this.renderer = new RigidConstraintRenderer(this);
	}

	calculateRestDistance() {
		const pos1 = this.pm1.getPosition();
		const pos2 = this.pm2.getPosition();
		this.rest_distance = pos1.distance(pos2);
		if (this.rest_distance === 0)
			throw new Error("Rigid constraint cannot have rest distance = 0. Please use Hinge constraint instead.");
		return this;
	}

	getPointMasses() {
		return [this.pm1, this.pm2];
	}

	/**
	*	The difference between rest distance and current distance
	**/
	}

	/**
	*	Get the "Stress" value of a rigid constraint
	*		(I don't even know what exactly stress is)
	**/
	getStress() {
		return -this.diff / this.rest_distance;
	}

	getRestDistanec() {
		return this.rest_distance;
	}

	//================================ Setters ================================
	
	/**
	*	Set pointmasses free from each other
	**/
	break() {
		this.is_broken = true;
		return this;
	}

	/**
	*	Connect both pointmasses back together
	*	@param [recalculate_rest_distance=false] false by default. Recalculate rest distance (use current distance between pointmasses). 
	**/
	restore(recalculate_rest_distance: boolean = false) {
		this.is_broken = false;
		if(recalculate_rest_distance) this.calculateRestDistance();
		return this;
	}

	setRestDistance(rest_distance: number, reset_pointmass_velocity: boolean = false) {
		this.rest_distance = rest_distance;
		if(reset_pointmass_velocity) {
			this.pointmass1.resetVelocity();
			this.pointmass2.resetVelocity();
		}
		return this;
	} 

	/**
	*	Check for differnece in current distance and rest distance 
	*		and immediately resolve the constraint by directly updating 
	*		the pointmasses position based on it relative weight to one another.
	*		TODO: create a correction build up mechanism for PointMass so that resolution 
	*			can be done after checking every constraint. 
	*			(temp_pos += corr_pos; count ++; temp_pos / corr_pos)
	**/
	update(_: number) {
		const pos1 = this.pm1.getPosition();
		const pos2 = this.pm2.getPosition();
		if (this.is_broken) return this;
		const curr_distance = pos1.distance(pos2);
		this.diff = this.rest_distance - curr_distance;

		if (Math.abs(this.diff) < 1e-9) return this;
		if (this.rest_distance === 0)
			throw new Error("Rigid constraint cannot have rest distance = 0. Please use Hinge constraint instead.");

		this.corr = this.diff / this.rest_distance; // TODO: make sure rest_distance is not zero
		const v = pos2.sub(pos1);

		const mass1 = this.pm1.isStatic() ? 0 : 1 / this.pm1.getMass();
		const mass2 = this.pm2.isStatic() ? 0 : 1 / this.pm2.getMass();
		const total_mass = (mass1 + mass2);

		const new_pos1 = pos1.sub(v.mul(this.corr * mass1 / total_mass));
		const new_pos2 = pos2.add(v.mul(this.corr * mass2 / total_mass));

		if (!this.pm1.isStatic()) this.pm1.setCurrentPosition(new_pos1);
		if (!this.pm2.isStatic()) this.pm2.setCurrentPosition(new_pos2);
	}
}
