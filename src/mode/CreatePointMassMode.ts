import Mode from "./Mode.ts";
import CreatePointMassModeRenderer from "../renderer/CreatePointMassModeRenderer.ts";
import { MouseButton } from "../core/Editor.ts";

export default class CreatePointMassMode extends Mode {
    public renderer!: CreatePointMassModeRenderer;

    public init() {
        this.renderer = new CreatePointMassModeRenderer(this);
    }

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

    private draw() {
        const canvas = this.editor.getOverlayCanvas();
        canvas.clear();
        this.renderer.drawHint(canvas.getContext(), this.editor.getMouseCurrentPosition());
    }

    onMouseMove(): void {
        this.draw();
    }

    onMouseDown(_button: MouseButton): void {
        return;
    }

    onMouseUp(_button: MouseButton): void {
        return;
    }
}