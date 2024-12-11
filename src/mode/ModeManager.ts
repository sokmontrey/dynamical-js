import CreatePointMassMode from "./CreatePointMassMode.ts";
import CreateRigidConstraintMode from "./CreateRigidConstraintMode.ts";
import MoveMode from "./MoveMode.ts";
import Mode from "./Mode.ts";
import Editor, {MouseButton} from "../core/Editor.ts";

export enum CreateMode {
    POINTMASS = "PointMass",
    RIGID_CONSTRAINT = "RigidConstraint",
}

export default class ModeManager {
    private current_mode!: Mode;
    private editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
        this.toMoveMode();
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

    onMouseMove() {
        this.current_mode.onMouseMove();
    }

    onMouseDown(button: MouseButton) {
        this.current_mode.onMouseDown(button);
    }

    onMouseUp(button: MouseButton) {
        this.current_mode.onMouseUp(button);
    }

    onMouseClick(button: MouseButton) {
        this.current_mode.onMouseClick(button);
    }
}