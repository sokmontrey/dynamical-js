import Interactor from "../interactor/Interactor";
import PhysicBodyRenderer from "../body-renderer/PhysicBodyRenderer.ts";
import Vec2 from "../utils/Vector.ts";
import Serializable from "../core/Serializable.ts";

export interface PhysicBodyProps { }

export enum PhysicBodyType {
	POINT_MASS,
	RIGID_CONSTRAINT,
}

export default abstract class PhysicBody implements Serializable<PhysicBodyProps> {
	protected id: string | null = null;
	protected abstract readonly type: PhysicBodyType;
	protected abstract readonly rank: number;

	public abstract renderer: PhysicBodyRenderer;
	public abstract interactor: Interactor;

	abstract serialize(): PhysicBodyProps;
	abstract deserialize(props: PhysicBodyProps): void;

	abstract update(dt: number): void;
	abstract getPosition(): Vec2;

	getType(): PhysicBodyType {
		return this.type;
	}

	getId(): string | null {
		return this.id;
	}

	setId(id: string): void {
		if (this.id) throw new Error("Physic body already has an id");
		this.id = id;
	}

	getRank(): number {
		return this.rank;
	}
}