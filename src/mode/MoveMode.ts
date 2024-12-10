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

    private is_mouse_dragging: boolean = false;
    private body_mouse_down_on: PhysicBody | null = null;
    private mouse_body_offset: Map<PhysicBody, Vec2> | null = null;

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
        if (this.physic_bodies.has(this.hovered_body)) // an option to remove selected body
            this.physic_bodies.delete(this.hovered_body);
        else
            this.physic_bodies.add(this.hovered_body);
        return this;
    }

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) {
            if (!this.editor.isKeyDown("Shift")) this.resetSelectedBodies();
            this.addHoveredBody();
        }
        this.draw();
    }

    onMouseMove(): void {
        this.checkHoveredBody();
        this.checkDragging();
        this.draw();
    }

    private checkDragging() {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const diff = mouse_pos.distance(this.editor.getMouseDownPosition());
        this.is_mouse_dragging = diff > this.editor.getDragThreshold() && this.editor.isMouseDown();
    }

    private checkHoveredBody() {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const hovered_bodies = this.body_manager.getHoveredBodies(mouse_pos);
        if (hovered_bodies.length) this.hovered_body = hovered_bodies[0];
        else this.hovered_body = null;
    }

    private onMouseDownOnSelectedBody() {
        this.mouse_body_offset = new Map<PhysicBody, Vec2>();
        const mouse_pos = this.editor.getMouseCurrentPosition();
        this.physic_bodies.forEach(body => {
            this.mouse_body_offset!.set(body, body.getPosition().sub(mouse_pos));
        });
    }

    private draw() {
        const canvas = this.editor.getOverlayCanvas();
        const ctx = canvas.getContext();
        canvas.clear();
        this.renderer.drawHoveredBody(ctx, this.hovered_body);
        this.renderer.drawSelectedBodies(ctx, this.physic_bodies);
        if (this.is_mouse_dragging && !this.isMouseDownOnSelectedBody()) {
            this.renderer.drawDraggingBox(ctx,
                this.editor.getMouseDownPosition(),
                this.editor.getMouseCurrentPosition());
        } else if(this.isMouseDownOnSelectedBody()) {
            this.moveSelectedBodies();
        }
    }

    private moveSelectedBodies() {
        if (!this.mouse_body_offset ) return;
        const mouse_pos = this.editor.getMouseCurrentPosition();
        this.mouse_body_offset!.forEach((offset, body) => {
            body.setPosition(mouse_pos.add(offset));
        });
        this.editor.stepBaseRenderer();
    }

    private resetBodies() {
        this.body_manager.getAllBodies().forEach(body => {
            body.resetAfterMoved();
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseDown(_button: MouseButton): void {
        this.body_mouse_down_on = this.hovered_body;
        if(this.isMouseDownOnSelectedBody()) {
            this.onMouseDownOnSelectedBody();
        }
    }

    onMouseUp(button: MouseButton): void {
        if (!this.is_mouse_dragging) return;
        if (!this.isMouseDownOnBody()) this.onSelectDragged(button);
        this.is_mouse_dragging = false;
        if (this.isMouseDownOnSelectedBody()){
            this.moveSelectedBodies();
            this.resetBodies();
            this.body_mouse_down_on = null;
            this.mouse_body_offset = null;
        }
    }

    isMouseDownOnBody(): boolean {
        return this.body_mouse_down_on != null;
    }

    isMouseDownOnSelectedBody(): boolean {
        return this.body_mouse_down_on != null &&
            this.physic_bodies.has(this.body_mouse_down_on);
    }

    /**
     * A drag that start from an empty space. For selection purpose.
     */
    private onSelectDragged(button: MouseButton): void {
        if (button != MouseButton.LEFT) return;
        const down_pos = this.editor.getMouseDownPosition();
        const curr_pos = this.editor.getMouseCurrentPosition();
        const lower= Vec2.min(down_pos, curr_pos);
        const upper= Vec2.max(down_pos, curr_pos);
        if (!this.editor.isKeyDown("Shift")) this.resetSelectedBodies();
        this.body_manager
            .getSelectedBodies(lower, upper)
            .forEach(body => {
                this.physic_bodies.add(body);
            });
        this.draw();
    }

    getPhysicBodies(): Set<PhysicBody> {
        return this.physic_bodies;
    }

    getHoveredBody(): PhysicBody | null {
        return this.hovered_body;
    }
}