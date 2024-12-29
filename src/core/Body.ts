import { PropBinder } from "../hooks/usePropBinder";
import BodyInteractor from "./BodyInteractor";
import BodyRenderer from "./BodyRenderer";

export enum BodyType {
	POINT_MASS = "point_mass",
	RIGID_CONSTRAINT = "rigid_constraint",
	CIRCULAR_KINEMATIC = "circular_kinematic",
}

export default abstract class Body<T, P> {
	protected id: string | null = null;
	protected abstract readonly type: BodyType;
	protected abstract readonly rank: number;
	protected abstract readonly moveable: boolean;
	protected on_update: (() => void) | null = null;

	protected abstract props: P;
	public abstract renderer: BodyRenderer<T>;
	public abstract interactor: BodyInteractor;

	abstract update(dt: number): void;
	abstract getPropBinders(): PropBinder<any>[];

	draw(ctx: CanvasRenderingContext2D, steps: number): void {
		// TODO: deal with this
		(this.renderer as any).draw(this, ctx, steps);
	}

	drawSelection(ctx: CanvasRenderingContext2D): void {
		(this.renderer as any).drawSelection(this, ctx);
	}

	//================================ Getters ================================

	getType(): BodyType {
		return this.type;
	}

	getId(): string | null {
		return this.id;
	}

	getRank(): number {
		return this.rank;
	}

	isMoveable(): boolean {
		return this.moveable;
	}

	abstract getDependencies(): string[];

	//================================ Setters ================================

	setId(id: string): void {
		if (this.id) throw new Error("Physic body already has an id");
		this.id = id;
	}

	setOnUpdate(on_update: () => void): () => void {
		this.on_update = on_update;
		return () => this.on_update = null;
	}

	triggerOnUpdate(): void {
		if (this.on_update) this.on_update();
	}

	//================================ Serialization ================================

	toJSON(): any {
		return {
			id: this.id,
			type: this.getType(),
			props: this.props,
			renderer: this.renderer.toJSON(),
		};
	}
	// abstract deserialize(serialized: any): void;
}