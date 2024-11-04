import PointMass from "./PointMass";

export interface RigidConstraintParams { };

export default class RigidConstraint {
	protected pm1: PointMass;
	protected pm2: PointMass;
	protected rest_distance: number = 0;

	constructor(pointmass1: PointMass,
		pointmass2: PointMass,
		{ }: RigidConstraintParams = {}) {

		this.pm1 = pointmass1;
		this.pm2 = pointmass2;
		this.calculateRestDistance();
	}

	calculateRestDistance() {
		const pos1 = this.pm1.getPosition();
		const pos2 = this.pm2.getPosition();
		this.rest_distance = pos1.distance(pos2);
		return this;
	}

}
