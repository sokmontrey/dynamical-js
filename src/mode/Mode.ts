import ModeManager from "./ModeManager.ts";
import Vec2 from "../utils/Vector.ts";
import Canvas from "../core/Canvas.ts";
import PhysicBodyManager from "../core-physic/PhysicBodyManager.ts";
import {MouseButton} from "../core/Editor.ts";

export default abstract class Mode {
    protected mode_manager!: ModeManager;
    protected body_manager!: PhysicBodyManager;
    protected overlay_canvas!: Canvas;

    public abstract init(): void;

    public setModeManager(mode_manager: ModeManager) {
        this.mode_manager = mode_manager;
    }

    public setBodyManager(body_manager: PhysicBodyManager) {
        this.body_manager = body_manager
    }

    public setOverlayCanvas(overlay_canvas: Canvas) {
        this.overlay_canvas = overlay_canvas;
    }

    abstract onMouseMove(): void;

    abstract onMouseDown(): void;

    abstract onMouseUp(): void;

    abstract onMouseDrag(button: MouseButton, mouse_start_pos: Vec2, mouse_curr_pos: Vec2): void;

    abstract onMouseClick(button: MouseButton, mouse_start_pos: Vec2): void;
}