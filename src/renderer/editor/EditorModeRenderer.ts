import EditorMode from "../../editor/EditorMode";
import Renderer from "../Renderer";

export default abstract class EditorModeRenderer implements Renderer {
	protected editor_mode: EditorMode;

	constructor(editor_mode: EditorMode) {
		this.editor_mode = editor_mode;
	}

    abstract draw(ctx: CanvasRenderingContext2D, steps: number): Renderer;
}
