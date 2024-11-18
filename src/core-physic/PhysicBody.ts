import Interactor from "../interactor/Interactor";
import Renderer from "../renderer/Renderer";

export default interface PhysicBody {
	renderer: Renderer;
	interactor: Interactor;
}

export enum PhysicBodyType {
	POINTMASS,
	RIGID_CONSTRAINT,
}
