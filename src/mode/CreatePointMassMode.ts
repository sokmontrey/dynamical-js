import Mode from "./Mode.ts";
import { MouseButton } from "../core/Editor.ts";
import CreatePointMassModeRenderer from "../mode-renderer/CreatePointMassModeRenderer.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";

export default class CreatePointMassMode extends Mode {
    public renderer: ModeRenderer = new CreatePointMassModeRenderer(this);

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) {
            this.addPointMass();
        }
        this.editor.stepBaseRenderer();
    }

    private addPointMass() {
        const position = this.editor.getMouseCurrentPosition();
        this.editor.createPointMass(position);
    }

    getMouseCurrentPosition() {
        return this.editor.getMouseCurrentPosition();
    }
}