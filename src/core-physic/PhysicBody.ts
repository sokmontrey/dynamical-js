import Interactor from "../interactor/Interactor";
import IRenderer from "../core/IRenderer.ts";

export default interface PhysicBody {
	renderer: IRenderer;
	interactor: Interactor;
}