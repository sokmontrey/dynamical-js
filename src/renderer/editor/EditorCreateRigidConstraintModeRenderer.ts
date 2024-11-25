import EditorCreateRigidConstraintMode from "../../editor/EditorCreateRigidConstraintMode";
import Renderer from "../Renderer";

export default class EditorCreateRigidConstraintModeRenderer implements Renderer {
	private editor_mode: EditorCreateRigidConstraintMode;

	constructor(editor_mode: EditorCreateRigidConstraintMode) {
		this.editor_mode = editor_mode;
	}

    draw(ctx: CanvasRenderingContext2D, steps: number): Renderer {
        throw new Error("Method not implemented.");
    }
}
