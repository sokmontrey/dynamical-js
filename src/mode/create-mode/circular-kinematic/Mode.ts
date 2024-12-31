import CircularKinematic from "@/body/circular-kinematic/Body";
import PointMass from "@/body/point-mass/Body";
import ModeRenderer from "@/core/ModeRenderer";
import BodyManager from "@/manager/BodyManager";
import InputManager, { MouseButton } from "@/manager/InputManager";
import LoopManager from "@/manager/LoopManager";
import Vec2 from "@/utils/Vector";
import Mode from "../point-mass/Mode";
import CircularKinematic_CreateModeRenderer from "./Renderer";

export default class CircularKinematic_CreateMode extends Mode {
    public renderer: ModeRenderer = new CircularKinematic_CreateModeRenderer(this);

    private center_pointmass: PointMass | null = null;
    private anchor_pointmass: PointMass | null = null;
    private hovered_pointmass: PointMass | null = null;

    private reset(): void {
        this.center_pointmass = null;
        this.anchor_pointmass = null;
        this.hovered_pointmass = null;
    }

    onMouseMove(): void {
        const mouse_pos = InputManager.getMousePosition();
        const hovered_bodies = BodyManager.getHoveredBodies(mouse_pos);
        
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
        const circular = new CircularKinematic({
            center_pointmass: this.center_pointmass,
            anchor_pointmass: this.anchor_pointmass,
        });
        BodyManager.addBody(circular);
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