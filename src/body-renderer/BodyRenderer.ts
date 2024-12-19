import Style from "../style/Style.ts";

export default abstract class BodyRenderer {
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): void;
	abstract drawSelection(ctx: CanvasRenderingContext2D): void;

	public toPlainObject(): {[key: string]: Style} {
		const filtered_entries = Object.entries(this).filter(([_, v]) => v instanceof Style);
		return Object.fromEntries(filtered_entries);
	}
}
