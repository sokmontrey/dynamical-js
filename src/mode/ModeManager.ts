import CreatePointMassMode from "./CreatePointMassMode.ts";
import CreateRigidConstraintMode from "./CreateRigidConstraintMode.ts";
import MoveMode from "./MoveMode.ts";
import Mode from "./Mode.ts";
import Editor from "../core/Editor.ts";

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

    public draw(ctx: CanvasRenderingContext2D): void {
        this.current_mode.renderer.draw(ctx, 1);
    }
}