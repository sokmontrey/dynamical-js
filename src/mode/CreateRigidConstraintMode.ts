import Mode from "./Mode.ts";
import CreateRigidConstraintModeRenderer from "../renderer/CreateRigidConstraintModeRenderer.ts";
import { MouseButton } from "../core/Editor.ts";
import PointMass from "../core-physic/PointMass.ts";
import PhysicBodyManager from "../core-physic/PhysicBodyManager.ts";
import Vec2 from "../utils/Vector.ts";

export default class CreateRigidConstraintMode extends Mode {
    public renderer!: CreateRigidConstraintModeRenderer;

    private pointmass1: PointMass | null = null;
    private pointmass2: PointMass | null = null;

    private body_manager!: PhysicBodyManager;
    private hovered_pointmass: PointMass | null = null;

    public init(): void {
        this.renderer = new CreateRigidConstraintModeRenderer(this);
        this.body_manager = this.editor.getPhysicBodyManager();
    }

    private reset() {
        this.pointmass1 = null;
        this.pointmass2 = null;
    }

    onMouseMove(): void {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const hovered_bodies = this.body_manager.getHoveredBodies(mouse_pos);
        if (!hovered_bodies.length) this.hovered_pointmass = null;
        else this.hovered_pointmass = hovered_bodies[0] as PointMass;
        this.draw();
    }

    private draw() {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const canvas = this.editor.getOverlayCanvas();
        const ctx = canvas.getContext();
        canvas.clear();
        if (this.hovered_pointmass) {
            this.renderer.drawSelectedPointmass(ctx, this.hovered_pointmass);
        }
        if (this.pointmass1) {
            this.renderer.drawSelectedPointmass(ctx, this.pointmass1);
            this.renderer.drawConstraintLine(ctx, this.pointmass1.getPosition(), mouse_pos);
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
        if (!this.pointmass1 ) {
            this.pointmass1 = this.hovered_pointmass;
        } else if (!this.pointmass2) {
            this.pointmass2 = this.hovered_pointmass;
            this.createRigidConstraint();
            this.reset();
        }
    }

    private createRigidConstraint() {
        if (!this.pointmass1 || !this.pointmass2) return;
        this.editor.getPhysicBodyManager().addRigidConstraint(
            this.pointmass1,
            this.pointmass2,
            {});
        this.editor.stepBaseRenderer();
    }

    onMouseDown(_button: MouseButton): void {
        return ;
    }

    onMouseUp(_button: MouseButton): void {
        return ;
    }
}