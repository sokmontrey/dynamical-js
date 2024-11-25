import EditorCreateRigidConstraintMode from "../../editor/EditorCreateRigidConstraintMode";
import IRenderer from "../IRenderer";

export default class EditorCreateRigidConstraintModeRenderer implements IRenderer {
	private editor_mode: EditorCreateRigidConstraintMode;

	constructor(editor_mode: EditorCreateRigidConstraintMode) {
		this.editor_mode = editor_mode;
	}

    draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer {
        throw new Error("Method not implemented.");
    }
}
