import Mode from "./Mode.ts";
import CreateCircularKinematicModeRenderer from "../mode-renderer/CreateCircularKinematicModeRenderer.ts";
import { MouseButton } from "../manager/InputManager.ts";
import PointMass from "../core-physic/PointMass.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";
import PhysicBodyManager from "../manager/PhysicBodyManager.ts";
import InputManager from "../manager/InputManager.ts";
import LoopManager from "../manager/LoopManager.ts";
import Vec2 from "../utils/Vector.ts";

export default class CreateCircularKinematicMode extends Mode {
    public renderer: ModeRenderer = new CreateCircularKinematicModeRenderer(this);

    private center_pointmass: PointMass | null = null;
    private anchor_pointmass: PointMass | null = null;
    private hovered_pointmass: PointMass | null = null;

    private reset(): void {
        this.center_pointmass = null;
        this.anchor_pointmass = null;
    }

    onMouseMove(): void {
        const mouse_pos = InputManager.getMousePosition();
        const hovered_bodies = PhysicBodyManager.getHoveredBodies(mouse_pos);
        
        if (!hovered_bodies.length || !(hovered_bodies[0] instanceof PointMass)) {
            this.hovered_pointmass = null;
        } else {
            this.hovered_pointmass = hovered_bodies[0] as PointMass;
        }
    }

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) {
            this.selectPointmass();
        } else if(button == MouseButton.RIGHT) {
            this.reset();
        }
    }

    private selectPointmass(): void {
        if (!this.hovered_pointmass) return;
        if (!this.center_pointmass) {
            this.center_pointmass = this.hovered_pointmass;
        } else if (!this.anchor_pointmass && this.center_pointmass != this.hovered_pointmass) {
            this.anchor_pointmass = this.hovered_pointmass;
            this.createCircularKinematic();
            this.reset();
        }
    }

    private createCircularKinematic(): void {
        if (!this.center_pointmass || !this.anchor_pointmass) return;
        PhysicBodyManager.createCircularKinematic(this.center_pointmass, this.anchor_pointmass);
        if (!LoopManager.isRunning()) LoopManager.render();
    }

    getHoveredPointMass(): PointMass | null {
        return this.hovered_pointmass;
    }

    getMouseCurrentPosition(): Vec2 {
        return InputManager.getMousePosition();
    }

    getCenterPointMass(): PointMass | null {
        return this.center_pointmass;
    }
}