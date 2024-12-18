import ModeManager from "./ModeManager.ts";
import Editor, {MouseButton} from "../core/Editor.ts";
import ModeRenderer from "../mode-renderer/ModeRenderer.ts";

export default abstract class Mode {
    public abstract renderer: ModeRenderer;
    protected mode_manager!: ModeManager;
    protected editor!: Editor;

    public setModeManager(mode_manager: ModeManager) {
        this.mode_manager = mode_manager;
    }

    public setEditor(editor: Editor) {
        this.editor = editor;
    }

    onMouseMove(): void { return; }

    onMouseDown(_button: MouseButton): void { return; }

    onMouseUp(_button: MouseButton): void { return; }

    onMouseClick(_button: MouseButton): void { return; }
}