import Mode from "./Mode.ts";
import Vec2 from "../utils/Vector.ts";
import {MouseButton} from "../core/Editor.ts";
import PhysicBody, { PhysicBodyType } from "../core-physic/PhysicBody.ts";
import MoveModeRenderer from "../mode-renderer/MoveModeRenderer.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";
import PointMass from "../core-physic/PointMass.ts";
import RigidConstraint from "../core-physic/RigidConstraint.ts";

export default class MoveMode extends Mode {
    public renderer: ModeRenderer = new MoveModeRenderer(this);

    private selected_bodies: Set<PhysicBody> = new Set<PhysicBody>();
    private hovered_body: PhysicBody | null = null;

    private is_mouse_dragging: boolean = false;
    private body_mouse_down_on: PhysicBody | null = null;
    private mouse_body_offset: Map<PhysicBody, Vec2> | null = null;

    private resetSelectedBodies(): void {
        this.selected_bodies = new Set<PhysicBody>();
    }

    private addHoveredBody(): void{
        if (!this.hovered_body) return;
        if (this.selected_bodies.has(this.hovered_body)) // an option to remove selected body
            this.selected_bodies.delete(this.hovered_body);
        else
            this.selected_bodies.add(this.hovered_body);
        return;
    }

    onMouseClick(button: MouseButton): void {
        if (button == MouseButton.LEFT) {
            if (!this.editor.isKeyDown("Shift")) this.resetSelectedBodies();
            this.addHoveredBody();
        }
    }

    onMouseMove(): void {
        this.checkHoveredBody();
        this.checkDragging();
        if (this.is_mouse_dragging && this.isMouseDownOnSelectedBody()){
            this.moveSelectedBodies();
        }
    }

    private checkDragging() {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const diff = mouse_pos.distance(this.editor.getMouseDownPosition());
        this.is_mouse_dragging = diff > this.editor.getDragThreshold() && this.editor.isMouseDown();
    }

    private checkHoveredBody() {
        const mouse_pos = this.editor.getMouseCurrentPosition();
        const body_manager = this.editor.getPhysicBodyManager();
        const hovered_bodies = body_manager.getHoveredBodies(mouse_pos);
        if (hovered_bodies.length) this.hovered_body = hovered_bodies[0];
        else this.hovered_body = null;
    }

    private onMouseDownOnSelectedBody() {
        this.mouse_body_offset = new Map<PhysicBody, Vec2>();
        const mouse_pos = this.editor.getMouseCurrentPosition();
        this.selected_bodies.forEach(body => {
            this.mouse_body_offset!.set(body, body.getPosition().sub(mouse_pos));
        });
    }

    private moveSelectedBodies() {
        if (!this.mouse_body_offset) return;
        const mouse_pos = this.editor.getMouseCurrentPosition();
        this.mouse_body_offset!.forEach((offset, body) => {
            this.moveBody(body, mouse_pos.add(offset));
        });
        if (!this.editor.isRunning()) {
            this.editor.stepBaseRenderer();
        }
    }

	private moveBody(body: PhysicBody, position: Vec2) {
		if (body.type === PhysicBodyType.POINT_MASS) {
			const pointmass = body as PointMass;
			pointmass.moveTo(position);
			if (!this.editor.isRunning()) {
                this.updateRigidConstraint(pointmass);
            }
		} 
	}

    private updateRigidConstraint(pointmass: PointMass) {
        const name = this.editor.getPhysicBodyManager().getName(pointmass);
        if (!name) return;
        this.editor.getDependencyManager()
            .findChilds(name)
            .map(child => this.editor.getPhysicBodyManager().getByName(child))
            .filter(child => child && child.type === PhysicBodyType.RIGID_CONSTRAINT)
            .forEach(_rigid => {
                const rigid = _rigid as RigidConstraint;
                // TODO: generalize this for other types of dependencies
                rigid?.calculateRestDistance();
            });
    }

    onMouseDown(_button: MouseButton): void {
        this.body_mouse_down_on = this.hovered_body;
        if(this.isMouseDownOnSelectedBody()) {
            this.onMouseDownOnSelectedBody();
        } else if (this.isMouseDownOnBody()) {
            if (this.selected_bodies.size) this.resetSelectedBodies();
            this.selected_bodies.add(this.body_mouse_down_on!);
            this.onMouseDownOnSelectedBody();
        }
    }

    onMouseUp(button: MouseButton): void {
        if (!this.is_mouse_dragging) return;
        if (!this.isMouseDownOnBody()) this.onSelectDragged(button);
        this.is_mouse_dragging = false;
        if (this.isMouseDownOnSelectedBody()){
            this.moveSelectedBodies();
            this.body_mouse_down_on = null;
            this.mouse_body_offset = null;
        }
    }

    isMouseDownOnBody(): boolean {
        return this.body_mouse_down_on != null;
    }

    isMouseDownOnSelectedBody(): boolean {
        return this.body_mouse_down_on != null &&
            this.selected_bodies.has(this.body_mouse_down_on);
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
        this.editor
            .getPhysicBodyManager()
            .getSelectedBodies(lower, upper)
            .forEach(body => {
                this.selected_bodies.add(body);
            });
    }

    getSelectedBodies(): Set<PhysicBody> {
        return this.selected_bodies;
    }

    getHoveredBody(): PhysicBody | null {
        return this.hovered_body;
    }

    public isDragging(): boolean {
        return this.is_mouse_dragging;
    }

    public getMouseDownPosition(): Vec2 {
        return this.editor.getMouseDownPosition();
    }

    public getMouseCurrentPosition(): Vec2 {
        return this.editor.getMouseCurrentPosition();
    }
}