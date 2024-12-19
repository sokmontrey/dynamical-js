import Interactor from "../interactor/Interactor";
import PhysicBodyRenderer from "../body-renderer/PhysicBodyRenderer.ts";
import PointMass from "./PointMass.ts";
import RigidConstraint from "./RigidConstraint.ts";
import Vec2 from "../utils/Vector.ts";

export default interface PhysicBody {
	readonly type: PhysicBodyType;

	renderer: PhysicBodyRenderer;
	interactor: Interactor;

	getProps(): any;
	getType(): PhysicBodyType;
	getPosition(): Vec2;
}

export enum PhysicBodyType {
	POINT_MASS,
	RIGID_CONSTRAINT,
}

export const isFirstRankBody = (x: PhysicBody) => x instanceof PointMass;
export const isSecondRankBody = (x: PhysicBody) => x instanceof RigidConstraint;