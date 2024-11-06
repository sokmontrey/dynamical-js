import RigidConstraintRenderer from "../renderer/RigidConstraintRenderer";
import PointMass from "./PointMass";

export interface RigidConstraintParams { };

export default class RigidConstraint {
	protected pm1: PointMass;
	protected pm2: PointMass;
	protected rest_distance: number = 0;
	protected diff: number;
	protected corr: number;

	public readonly renderer: RigidConstraintRenderer;

	constructor(pointmass1: PointMass, pointmass2: PointMass, {
	}: RigidConstraintParams = {}) {

		this.pm1 = pointmass1;
		this.pm2 = pointmass2;
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

	/**
	*	return pointmass1 if is_second_pointmass = false
	*		   pointmass2 otherwise
	**/
	getPointMass(is_second_pointmass: boolean = false) {
		return is_second_pointmass ? this.pm2 : this.pm1;
	}

	/**
	*	Get the "Stress" value of a rigid constraint
	*		(I don't even know what exactly stress is)
	**/
	getStress() {
		return -this.diff / this.rest_distance;
	}

	update(_: number) {
		const pos1 = this.pm1.getPosition();
		const pos2 = this.pm2.getPosition();
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
