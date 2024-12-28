import Vec2 from "../utils/Vector";
import BodyInteractor from "./BodyInteractor";
import BodyPanelProps from "./BodyPanelProps";
import BodyRenderer from "./BodyRenderer";
import Serializable from "./Serializable";

export enum BodyType {
	POINT_MASS = "point_mass",
	RIGID_CONSTRAINT = "rigid_constraint",
	CIRCULAR_KINEMATIC = "circular_kinematic",
}

export interface BodyProps { }

// TODO: deal with serialization
export default abstract class Body implements Serializable<BodyProps> {
	protected id: string | null = null;
	protected abstract readonly type: BodyType;
	protected abstract readonly rank: number;

	protected on_update: (() => void) | null = null;

	public abstract panel_property: BodyPanelProps;
	public abstract renderer: BodyRenderer;
	public abstract interactor: BodyInteractor;

	abstract serialize(): BodyProps;
	abstract deserialize(props: BodyProps): void;

	abstract update(dt: number): void;
	abstract getPosition(): Vec2;

	getType(): BodyType {
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

	setOnUpdate(on_update: () => void): () => void {
		this.on_update = on_update;
		return () => this.on_update = null;
	}

	triggerOnUpdate(): void {
		if (this.on_update) this.on_update();
	}
}