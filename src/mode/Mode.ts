import ModeManager from "./ModeManager.ts";
import Vec2 from "../utils/Vector.ts";
import Editor, {MouseButton} from "../core/Editor.ts";

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

    abstract onMouseMove(): void;

    abstract onMouseDown(): void;

    abstract onMouseUp(): void;

    abstract onMouseDrag(button: MouseButton, mouse_start_pos: Vec2, mouse_curr_pos: Vec2): void;

    abstract onMouseClick(button: MouseButton, mouse_start_pos: Vec2): void;
}