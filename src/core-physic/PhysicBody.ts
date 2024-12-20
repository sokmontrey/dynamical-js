import Interactor from "../interactor/Interactor";
import PhysicBodyRenderer from "../body-renderer/PhysicBodyRenderer.ts";
import Vec2 from "../utils/Vector.ts";
import Serializable from "../core/Serializable.ts";

export interface PhysicBodyProps { }

export enum PhysicBodyType {
	POINT_MASS,
	RIGID_CONSTRAINT,
}

export default interface PhysicBody extends Serializable<PhysicBodyProps> {
	readonly type: PhysicBodyType;
	readonly rank: number;

	renderer: PhysicBodyRenderer;
	interactor: Interactor;

	update(dt: number): void;
	getType(): PhysicBodyType;
	getPosition(): Vec2;
}