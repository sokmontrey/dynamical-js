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
        this.draw();
    }

    private draw() {
        const canvas = this.editor.getOverlayCanvas();
        canvas.clear();
        this.renderer.draw(canvas.getContext(), 1);
    }

    private resetSelectedBodies() {
        this.physic_bodies = new Set<PhysicBody>();
        return this;
    }

    private addOneBody(mouse_pos: Vec2) {
        const hovered_bodies = this.body_manager.getHoveredBodies(mouse_pos);
        if (!hovered_bodies.length) return this;
        const body = hovered_bodies[0];
        if (this.physic_bodies.has(body)) this.physic_bodies.delete(body);
        else this.physic_bodies.add(body);
        return this;
    }

    onMouseDrag(button: MouseButton, mouse_start_pos: Vec2, mouse_curr_pos: Vec2): void {
        console.log("MoveMode.onMouseDrag");
    }

    getPhysicBodies(): Set<PhysicBody> {
        return this.physic_bodies;
    }

    onMouseMove(): void { return; }
    onMouseDown(): void { return; }
    onMouseUp(): void { return; }
}