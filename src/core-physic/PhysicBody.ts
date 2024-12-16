import Interactor from "../interactor/Interactor";
import IRenderer from "../renderer/IRenderer.ts";
import PointMass from "./PointMass.ts";
import RigidConstraint from "./RigidConstraint.ts";
import Vec2 from "../utils/Vector.ts";

export default interface PhysicBody {
	renderer: IRenderer;
	interactor: Interactor;

	getPosition(): Vec2;
	move(position: Vec2): void;
	// TODO: determine the return type
	getProps(): any;
	getType(): PhysicBodyType;
}

export enum PhysicBodyType {
	POINT_MASS,
	RIGID_CONSTRAINT,
}

export const isFirstRankBody = (x: PhysicBody) => x instanceof PointMass;
export const isSecondRankBody = (x: PhysicBody) => x instanceof RigidConstraint;