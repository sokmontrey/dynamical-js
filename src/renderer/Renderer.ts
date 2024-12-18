import Style from "../style/Style.ts";

export default abstract class Renderer {
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): void;
	abstract drawSelection(ctx: CanvasRenderingContext2D): void;

	toPlainObject() {
		const filtered_entries = Object.entries(this).filter(([_, v]) => v instanceof Style);
		return Object.fromEntries(filtered_entries);
	}
}
