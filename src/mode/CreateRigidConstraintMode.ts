import Mode from "./Mode.ts";
import CreateRigidConstraintModeRenderer from "../mode-renderer/CreateRigidConstraintModeRenderer.ts";
import { MouseButton } from "../core/Editor.ts";
import PointMass from "../core-physic/PointMass.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";

export default class CreateRigidConstraintMode extends Mode {
    public renderer: ModeRenderer = new CreateRigidConstraintModeRenderer(this);

    private pointmass1: PointMass | null = null;
    private pointmass2: PointMass | null = null;
    private hovered_pointmass: PointMass | null = null;

    private reset() {
        this.pointmass1 = null;
        this.pointmass2 = null;
    }

    onMouseMove(): void {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const body_manager = this.editor.getPhysicBodyManager();

        const hovered_bodies = body_manager.getHoveredBodies(mouse_pos);
        if (!hovered_bodies.length || !(hovered_bodies[0] instanceof PointMass)) {
            this.hovered_pointmass = null;
        } else {
            this.hovered_pointmass = hovered_bodies[0] as PointMass;
        }
    }

    onMouseClick(_button: MouseButton): void {
        if (_button == MouseButton.LEFT) {
            this.selectPointmass();
        } else if(_button == MouseButton.RIGHT) {
            this.reset();
        }
    }

    private selectPointmass() {
        if (!this.hovered_pointmass) return;
        if (!this.pointmass1) {
            this.pointmass1 = this.hovered_pointmass;
        } else if (!this.pointmass2) {
            this.pointmass2 = this.hovered_pointmass;
            this.createRigidConstraint();
            this.reset();
        }
    }

    private createRigidConstraint() {
        if (!this.pointmass1 || !this.pointmass2) return;
        this.editor.createRigidConstraint(this.pointmass1, this.pointmass2);
        this.editor.stepBaseRenderer();
    }

    getHoveredPointMass() {
        return this.hovered_pointmass;
    }

    getMouseCurrentPosition() {
        return this.editor.getMouseCurrentPosition();
    }

    getFirstPointMass() {
        return this.pointmass1;
    }
}