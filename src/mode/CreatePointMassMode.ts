import Mode from "./Mode.ts";
import InputManager, { MouseButton } from "../manager/InputManager.ts";
import CreatePointMassModeRenderer from "../mode-renderer/CreatePointMassModeRenderer.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";
import PhysicBodyManager from "../manager/PhysicBodyManager.ts";
import Vec2 from "../utils/Vector.ts";
import LoopManager from "../manager/LoopManager.ts";

export default class CreatePointMassMode extends Mode {
    public renderer: ModeRenderer = new CreatePointMassModeRenderer(this);

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) this.addPointMass();
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    private addPointMass(): void {
        const position = InputManager.getMousePosition();
        PhysicBodyManager.addPointMass(position);
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    getMouseCurrentPosition(): Vec2 {
        return InputManager.getMousePosition();
    }
}