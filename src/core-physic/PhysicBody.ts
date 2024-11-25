import Interactor from "../interactor/Interactor";
import IRenderer from "../renderer/IRenderer";

export default interface PhysicBody {
	renderer: IRenderer;
	interactor: Interactor;
}

export enum PhysicBodyType {
	POINTMASS,
	RIGID_CONSTRAINT,
}
