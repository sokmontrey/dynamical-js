import EditorCreatePointMassMode from "../../editor/EditorCreatePointMassMode";
import Renderer from "../Renderer";

export default class EditorCreatePointMassModeRenderer implements Renderer {
	private editor_mode: EditorCreatePointMassMode;

	constructor(editor_mode: EditorCreatePointMassMode) {
		this.editor_mode = editor_mode;
	}

    draw(ctx: CanvasRenderingContext2D, steps: number): Renderer {
        throw new Error("Method not implemented.");
    }
}
