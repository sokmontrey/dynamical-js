import CreatePointMassMode from "./CreatePointMassMode.ts";
import CreateRigidConstraintMode from "./CreateRigidConstraintMode.ts";
import MoveMode from "./MoveMode.ts";
import Mode from "./Mode.ts";
import Editor from "../core/Editor.ts";
import Vec2 from "../utils/Vector.ts";
import Canvas from "../core/Canvas.ts";

export enum CreateMode {
    POINTMASS,
    RIGID_CONSTRAINT,
}

export default class ModeManager {
    private current_mode!: Mode;
    private editor: Editor;

    constructor(editor: Editor) {
        this.toMoveMode();
        this.editor = editor;
    }

    public toCreateMode(create_mode: CreateMode) {
        switch (create_mode) {
            case CreateMode.POINTMASS:
                this.toMode(new CreatePointMassMode());
                break;
            case CreateMode.RIGID_CONSTRAINT:
                this.toMode(new CreateRigidConstraintMode());
                break;
            default:
                throw new Error("Invalid create mode");
        }
        this.current_mode.init();
    }

    public toMoveMode() {
        this.toMode(new MoveMode());
    }

    public toMode(mode: Mode) {
        this.current_mode = mode;
        this.current_mode.setModeManager(this);
        this.current_mode.setEditor(this.editor);
        this.current_mode.init();
    }

    onMouseMove(canvas: Canvas) {
        this.current_mode.onMouseMove(canvas);
    }

    onMouseDown(canvas: Canvas) {
        this.current_mode.onMouseDown(canvas);

    }

    onMouseUp(canvas: Canvas) {
        this.current_mode.onMouseUp(canvas);
    }

    onMouseDrag(button: number, mouse_start_pos: Vec2, mouse_curr_pos: Vec2) {
        this.current_mode.onMouseDrag(button, mouse_start_pos, mouse_curr_pos);
    }

    onMouseClick(button: number, mouse_start_pos: Vec2) {
        this.current_mode.onMouseClick(button, mouse_start_pos);
    }
}