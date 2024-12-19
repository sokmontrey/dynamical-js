import Interactor from "../interactor/Interactor";
import PhysicBodyRenderer from "../body-renderer/PhysicBodyRenderer.ts";
import Vec2 from "../utils/Vector.ts";

export enum PhysicBodyType {
	POINT_MASS,
	RIGID_CONSTRAINT,
}

export default interface PhysicBody {
	readonly type: PhysicBodyType;
	readonly rank: number;

	renderer: PhysicBodyRenderer;
	interactor: Interactor;

	update(dt: number): void;
	toPlainObject(): any;
	getType(): PhysicBodyType;
	getPosition(): Vec2;
}