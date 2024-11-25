import Editor, { MouseButton } from "./Editor";
import Vec2 from "../utils/math/Vector";
import Renderer from "../renderer/Renderer";

export default interface EditorMode {
	ctx: CanvasRenderingContext2D;
	editor: Editor;
	readonly renderer: Renderer;
	onClick(button: MouseButton, pos: Vec2): void;
	onDragEnd(button: MouseButton, start: Vec2, end: Vec2): void;
	onMouseMove(is_mouse_down: boolean, pos: Vec2): void;
}
