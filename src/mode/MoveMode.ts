import Mode from "./Mode.ts";
import MoveModeRenderer from "../renderer/MoveModeRenderer.ts";
import Vec2 from "../utils/Vector.ts";
import {MouseButton} from "../core/Editor.ts";
import PhysicBody from "../core-physic/PhysicBody.ts";
import PhysicBodyManager from "../core-physic/PhysicBodyManager.ts";

export default class MoveMode extends Mode {
    public renderer!: MoveModeRenderer;

    private physic_bodies: Set<PhysicBody> = new Set<PhysicBody>();
    private body_manager!: PhysicBodyManager;

    public init(): void {
        this.renderer = new MoveModeRenderer(this);
        this.body_manager = this.editor.getPhysicBodyManager();
    }

    onMouseClick(button: MouseButton, mouse_pos: Vec2): void {
        if (button == MouseButton.LEFT) {
            if (this.editor.isKeyDown("Shift")) this.addOneBody(mouse_pos);
            else this.resetSelectedBodies().addOneBody(mouse_pos);
        }
        this.renderSelectedBodies();
        console.log(this.physic_bodies);
    }

    private renderSelectedBodies() {
        const ctx = this.editor.getOverlayCanvas().getContext();
        this.physic_bodies.forEach(body => body.renderer.drawBoundingBox(ctx));
    }

    private resetSelectedBodies() {
        this.physic_bodies = new Set<PhysicBody>();
        return this;
    }

    private addOneBody(mouse_pos: Vec2) {
        const hovered_bodies = this.body_manager.getHoveredBodies(mouse_pos);
        if (!hovered_bodies.length) return this;
        this.physic_bodies.add(hovered_bodies[0]);
        return this;
    }

    onMouseDrag(button: MouseButton, mouse_start_pos: Vec2, mouse_curr_pos: Vec2): void {
        console.log("MoveMode.onMouseDrag");
    }

    onMouseMove(): void { return; }
    onMouseDown(): void { return; }
    onMouseUp(): void { return; }
}