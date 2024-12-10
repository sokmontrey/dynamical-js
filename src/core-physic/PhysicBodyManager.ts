import Vec2 from "../utils/Vector";
import PhysicBody from "./PhysicBody";
import PointMass, { PointMassParams } from "./PointMass";
import RigidConstraint, { RigidConstraintParams } from "./RigidConstraint";

export default class PhysicBodyManager {
	private bodies: { [key: string]: PhysicBody };
	private seed: number;

	constructor() {
		this.bodies = {};
		this.seed = 0;
	}

	addPointmass(params: PointMassParams) {
		const pointmass = new PointMass(params);
		this.bodies[this.seed++] = pointmass;
		return this;
	}

	addRigidConstraint(pointmass1: PointMass,
		pointmass2: PointMass,
		params: RigidConstraintParams
	) {
		const rigid_constraint = new RigidConstraint(pointmass1, pointmass2, params);
		this.bodies[this.seed++] = rigid_constraint;
		return this;
	}

	addBody(body: PhysicBody) {
		this.bodies[this.seed++] = body;
		return this;
	}

	removeBody(body: PhysicBody) {
		const key = Object.keys(this.bodies).find(key => this.bodies[key] === body);
		if (key) delete this.bodies[key];
		// TODO: cascade pointmass delete to also delete constraints
		// TRY: PhysicBody.isUsingBody(body) to check if body is used by other bodies
		return this;
	}

	getAllBodies() {
		return Object.values(this.bodies);
	}

	getHoveredBodies(pos: Vec2) {
		return Object
			.values(this.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isHovered(pos));
	}

	getSelectedBodies(lower: Vec2, upper: Vec2) {
		return Object
			.values(this.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isSelected(lower, upper));
	}
}
