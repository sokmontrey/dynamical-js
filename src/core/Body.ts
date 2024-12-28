export enum BodyType {
	POINT_MASS = "point_mass",
	RIGID_CONSTRAINT = "rigid_constraint",
	CIRCULAR_KINEMATIC = "circular_kinematic",
}

export default abstract class Body<P, R> {
	protected id: string | null = null;
	protected abstract readonly type: BodyType;
	protected abstract readonly rank: number;
	protected abstract readonly moveable: boolean;
	protected on_update: (() => void) | null = null;

	// public abstract panel_property: BodyPanelProps;
	// public abstract interactor: BodyInteractor;

	protected abstract props: P;
	protected abstract renderer: R;

	abstract update(dt: number): void;
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): void;
	abstract drawSelection(ctx: CanvasRenderingContext2D): void;

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
}