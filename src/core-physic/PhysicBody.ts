import Interactor from "../interactor/Interactor";
import IRenderer from "../renderer/IRenderer.ts";
import PointMass from "./PointMass.ts";
import RigidConstraint from "./RigidConstraint.ts";

export default interface PhysicBody {
	renderer: IRenderer;
	interactor: Interactor;
}

export const isFirstRankBody = (x: PhysicBody) => x instanceof PointMass;
export const isSecondRankBody = (x: PhysicBody) => x instanceof RigidConstraint;
