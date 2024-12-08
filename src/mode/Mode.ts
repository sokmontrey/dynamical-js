import ModeManager from "./ModeManager.ts";
import Editor from "../core/Editor.ts";
import Vec2 from "../utils/Vector.ts";
import Canvas from "../core/Canvas.ts";

export default abstract class Mode {
    protected mode_manager!: ModeManager;
    protected editor!: Editor;

    public abstract init(): void;

    public setModeManager(mode_manager: ModeManager) {
        this.mode_manager = mode_manager;
    }

    public setEditor(editor: Editor) {
        this.editor = editor;
    }

    abstract onMouseMove(canvas: Canvas): void;

    abstract onMouseDown(canvas: Canvas): void;

    abstract onMouseUp(canvas: Canvas): void;

    abstract onMouseDrag(button: number, mouse_start_pos: Vec2, mouse_curr_pos: Vec2, canvas: Canvas): void;

    abstract onMouseClick(button: number, mouse_start_pos: Vec2, canvas: Canvas): void;
}