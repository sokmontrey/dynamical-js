import PointMass from "@/body/point-mass/Body";
import Mode from "@/core/Mode";
import ModeRenderer from "@/core/ModeRenderer";
import BodyManager from "@/manager/BodyManager";
import InputManager, { MouseButton } from "@/manager/InputManager";
import LoopManager from "@/manager/LoopManager";
import Vec2 from "@/utils/Vector";
import PointMass_CreateModeRenderer from "./Renderer";

export default class PointMass_CreateMode extends Mode {
    public renderer: ModeRenderer = new PointMass_CreateModeRenderer(this);

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) this.addPointMass();
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    private addPointMass(): void {
        const position = InputManager.getMousePosition();
        const pointmass = new PointMass({
            props: { position },
        });
        BodyManager.addBody(pointmass);
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    getMouseCurrentPosition(): Vec2 {
        return InputManager.getMousePosition();
    }
}