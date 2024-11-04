import PointMass from "./PointMass";

export default class RigidConstraint {
	protected pointmass1: PointMass;
	protected pointmass2: PointMass;
	protected rest_distance: number = 0;


	calculateRestDistance() {
		const pos1 = this.pointmass1.getPosition();
		const pos2 = this.pointmass2.getPosition();
		this.rest_distance = pos1.distance(pos2);
		return this;
	}
}
