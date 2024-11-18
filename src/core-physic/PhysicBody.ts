import Interactor from "../interactor/Interactor";
import Renderer from "../renderer/Renderer";
import PointMass from "./PointMass";
import RigidConstraint from "./RigidConstraint";

export default interface PhysicBody {
	renderer: Renderer;
	interactor: Interactor;
}

export enum PhysicBodyType {
	POINTMASS,
	RIGID_CONSTRAINT,
}

export const create = (type: PhysicBodyType, params: any) => {
	switch(type) {
	case PhysicBodyType.POINTMASS:
		return new PointMass(params);
	case PhysicBodyType.RIGID_CONSTRAINT:
		return new RigidConstraint(params.pointmass1, params.pointmass2, params);
	default:
		throw new Error("Undefined Physic Body Type");
	}
};
