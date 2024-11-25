import Editor, { MouseButton } from "./Editor";
import Vec2 from "../utils/math/Vector";
import IRenderer from "../renderer/Renderer";

export default interface IEditorMode {
	ctx: CanvasRenderingContext2D;
	editor: Editor;
	readonly renderer: IRenderer;
	onClick(button: MouseButton, pos: Vec2): void;
	onDragEnd(button: MouseButton, start: Vec2, end: Vec2): void;
	onMouseMove(is_mouse_down: boolean, pos: Vec2): void;
}
