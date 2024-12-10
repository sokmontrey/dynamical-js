import Mode from "./Mode.ts";
import MoveModeRenderer from "../renderer/MoveModeRenderer.ts";
import Vec2 from "../utils/Vector.ts";
import {MouseButton} from "../core/Editor.ts";
import PhysicBody from "../core-physic/PhysicBody.ts";
import PhysicBodyManager from "../core-physic/PhysicBodyManager.ts";

export default class MoveMode extends Mode {
    public renderer!: MoveModeRenderer;

    private physic_bodies: Set<PhysicBody> = new Set<PhysicBody>();
    private hovered_body: PhysicBody | null = null;
    private body_manager!: PhysicBodyManager;

    public init(): void {
        this.renderer = new MoveModeRenderer(this);
        this.body_manager = this.editor.getPhysicBodyManager();
    }

    private resetSelectedBodies() {
        this.physic_bodies = new Set<PhysicBody>();
        return this;
    }

    private addHoveredBody() {
        if (!this.hovered_body) return this;
        if (this.physic_bodies.has(this.hovered_body)) this.physic_bodies.delete(this.hovered_body);
        else this.physic_bodies.add(this.hovered_body);
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseClick(button: MouseButton, _mouse_pos: Vec2): void {
        if (button == MouseButton.LEFT) {
            if (this.editor.isKeyDown("Shift")) this.addHoveredBody();
            else this.resetSelectedBodies().addHoveredBody();
        }
        this.draw();
    }

    onMouseMove(): void {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const hovered_bodies = this.body_manager.getHoveredBodies(mouse_pos);
        if (hovered_bodies.length) this.hovered_body = hovered_bodies[0];
        else this.hovered_body = null;
        this.draw();
    }

    private draw() {
        const canvas = this.editor.getOverlayCanvas();
        const ctx = canvas.getContext();
        canvas.clear();
        this.renderer.drawHoveredBody(ctx, this.hovered_body);
        this.renderer.drawSelectedBodies(ctx, this.physic_bodies);
        if (this.editor.isMouseDragging()) {
            this.renderer.drawDraggingBox(ctx,
                this.editor.getMouseStartPosition(),
                this.editor.getMouseCurrentPosition());
        }
    }

    onMouseDown(): void { return; }

    onMouseUp(): void { return; }

    onMouseDragged(button: MouseButton, mouse_start_pos: Vec2, mouse_curr_pos: Vec2): void {
    }

    getPhysicBodies(): Set<PhysicBody> {
        return this.physic_bodies;
    }

    getHoveredBody(): PhysicBody | null {
        return this.hovered_body;
    }
}