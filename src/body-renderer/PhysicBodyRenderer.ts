import Style from "../style/Style.ts";
import Serializable from "../core/Serializable.ts";

export interface PhysicBodyRendererProps { }	

export default abstract class PhysicBodyRenderer implements Serializable<PhysicBodyRendererProps> {
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): void;
	abstract drawSelection(ctx: CanvasRenderingContext2D): void;

	public serialize(): PhysicBodyRendererProps {
		const filtered_entries = Object.entries(this).filter(([_, v]) => v instanceof Style);
		return Object.fromEntries(filtered_entries);
	}

	public deserialize(_data: PhysicBodyRendererProps): void {
		// TODO: Implement this later
	}
}