import Vec2 from "../utils/math/Vector";
import { MouseButton } from "./Editor";

export default abstract class EditorMode {
	abstract onClick(button: MouseButton, pos: Vec2): void;
	abstract onDrag(button: MouseButton, pos: Vec2): void;
}
