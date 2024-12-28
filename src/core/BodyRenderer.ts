import Style from "../style/Style.ts";
import Serializable from "./Serializable.ts";

export interface BodyRendererProps { }	

export default abstract class BodyRenderer implements Serializable<BodyRendererProps> {
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): void;
	abstract drawSelection(ctx: CanvasRenderingContext2D): void;

	public serialize(): BodyRendererProps {
		const filtered_entries = Object.entries(this).filter(([_, v]) => v instanceof Style);
		return Object.fromEntries(filtered_entries);
	}

	public deserialize(_data: BodyRendererProps): void {
		// TODO: Implement this later
	}
}