import Mode from "../../../core/Mode.ts";
import ModeRenderer from "../../../core/ModeRenderer.ts";
import BodyManager from "../../../manager/BodyManager.ts";
import InputManager, { MouseButton } from "../../../manager/InputManager.ts";
import LoopManager from "../../../manager/LoopManager.ts";
import Vec2 from "../../../utils/Vector.ts";
import PointMass_CreateModeRenderer from "./Renderer.ts";

export default class PointMass_CreateMode extends Mode {
    public renderer: ModeRenderer = new PointMass_CreateModeRenderer(this);

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) this.addPointMass();
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    private addPointMass(): void {
        const position = InputManager.getMousePosition();
        BodyManager.createPointMass({ 
            props: { position },
        });
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    getMouseCurrentPosition(): Vec2 {
        return InputManager.getMousePosition();
    }
}