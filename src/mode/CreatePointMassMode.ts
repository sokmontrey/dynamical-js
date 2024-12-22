import Mode from "./Mode.ts";
import InputManager, { MouseButton } from "../manager/InputManager.ts";
import CreatePointMassModeRenderer from "../mode-renderer/CreatePointMassModeRenderer.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";
import PhysicBodyManager from "../manager/PhysicBodyManager.ts";
import DependencyManager from "../manager/DependencyManager.ts";
import PointMass from "../core-physic/PointMass.ts";
import Vec2 from "../utils/Vector.ts";
import LoopManager from "../manager/LoopManager.ts";

export default class CreatePointMassMode extends Mode {
    public renderer: ModeRenderer = new CreatePointMassModeRenderer(this);

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) {
            this.addPointMass();
        }
        if (!LoopManager.isRunning()) {
            LoopManager.render();
        }
    }

    private addPointMass(): void {
        const position = InputManager.getMousePosition();
        // TODO: reuse this part of adding body along with updating the dependency manager
        // write this code somewhere in top-level
        const pointmass = new PointMass({ position });
        const name = PhysicBodyManager.addBody(pointmass);
        DependencyManager.setDependency(name, {});
    }

    getMouseCurrentPosition(): Vec2 {
        return InputManager.getMousePosition();
    }
}