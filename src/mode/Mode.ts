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

    onMouseMove(canvas: Canvas) {
        return;
    }

    onMouseDown(canvas: Canvas) {
        return;
    }

    onMouseUp(canvas: Canvas) {
        return;
    }

    onMouseDrag(button: number, mouse_start_pos: Vec2, mouse_curr_pos: Vec2) {
        return;
    }

    onMouseClick(button: number, mouse_start_pos: Vec2) {
        return;
    }
}