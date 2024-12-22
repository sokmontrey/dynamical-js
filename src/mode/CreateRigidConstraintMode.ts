import Mode from "./Mode.ts";
import CreateRigidConstraintModeRenderer from "../mode-renderer/CreateRigidConstraintModeRenderer.ts";
import { MouseButton } from "../manager/InputManager.ts";
import PointMass from "../core-physic/PointMass.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";
import PhysicBodyManager from "../manager/PhysicBodyManager.ts";
import InputManager from "../manager/InputManager.ts";
import LoopManager from "../manager/LoopManager.ts";
import RigidConstraint from "../core-physic/RigidConstraint.ts";
import DependencyManager from "../manager/DependencyManager.ts";
import Vec2 from "../utils/Vector.ts";

export default class CreateRigidConstraintMode extends Mode {
    public renderer: ModeRenderer = new CreateRigidConstraintModeRenderer(this);

    private pointmass1: PointMass | null = null;
    private pointmass2: PointMass | null = null;
    private hovered_pointmass: PointMass | null = null;

    private reset(): void {
        this.pointmass1 = null;
        this.pointmass2 = null;
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
        if (!this.pointmass1) {
            this.pointmass1 = this.hovered_pointmass;
        } else if (!this.pointmass2) {
            this.pointmass2 = this.hovered_pointmass;
            this.createRigidConstraint();
            this.reset();
        }
    }

    private createRigidConstraint(): void {
        if (!this.pointmass1 || !this.pointmass2) return;
        
        const rigid_constraint = new RigidConstraint(this.pointmass1, this.pointmass2);
        const pm1_name = PhysicBodyManager.getName(this.pointmass1) || "";
        const pm2_name = PhysicBodyManager.getName(this.pointmass2) || "";

        const name = PhysicBodyManager.addBody(rigid_constraint);
        DependencyManager.setDependency(name, { 
            pointmass1: pm1_name, 
            pointmass2: pm2_name 
        });

        if (!LoopManager.isRunning()) {
            LoopManager.render();
        }
    }

    getHoveredPointMass(): PointMass | null {
        return this.hovered_pointmass;
    }

    getMouseCurrentPosition(): Vec2 {
        return InputManager.getMousePosition();
    }

    getFirstPointMass(): PointMass | null {
        return this.pointmass1;
    }
}