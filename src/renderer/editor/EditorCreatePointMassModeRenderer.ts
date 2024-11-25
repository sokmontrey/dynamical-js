import EditorCreatePointMassMode from "../../editor/EditorCreatePointMassMode";
import IRenderer from "../IRenderer";

export default class EditorCreatePointMassModeRenderer implements IRenderer {
	private editor_mode: EditorCreatePointMassMode;

	constructor(editor_mode: EditorCreatePointMassMode) {
		this.editor_mode = editor_mode;
	}

    draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer {
        throw new Error("Method not implemented.");
    }
}
