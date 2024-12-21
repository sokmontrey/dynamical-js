import CreatePointMassMode from "./CreatePointMassMode.ts";
import CreateRigidConstraintMode from "./CreateRigidConstraintMode.ts";
import MoveMode from "./MoveMode.ts";
import Mode from "./Mode.ts";
import { MouseButton } from "../core/Editor.ts";

export enum ModeType {
    MOVE = "Move",
    CREATE_POINTMASS = "CreatePointMass",
    CREATE_RIGID_CONSTRAINT = "CreateRigidConstraint",
}

export default class ModeManager {
    private current_mode_type!: ModeType;
    private current_mode!: Mode;

    constructor() {
        this.toMoveMode();
    }

    //================================ Mode Management ================================ 

    public toCreateMode(create_mode: ModeType) {
        switch (create_mode) {
            case ModeType.CREATE_POINTMASS:
                this.toMode(new CreatePointMassMode(), ModeType.CREATE_POINTMASS);
                break;
            case ModeType.CREATE_RIGID_CONSTRAINT:
                this.toMode(new CreateRigidConstraintMode(), ModeType.CREATE_RIGID_CONSTRAINT);
                break;
            default:
                throw new Error("Invalid create mode");
        }
    }

    public toMoveMode() {
        this.toMode(new MoveMode(), ModeType.MOVE);
    }

    private toMode(mode: Mode, mode_type: ModeType) {
        this.current_mode = mode;
        this.current_mode_type = mode_type;
        this.current_mode.setModeManager(this);
    }

	//================================ Mouse Events ================================

    public onMouseMove() {
        this.current_mode.onMouseMove();
    }

    public onMouseDown(button: MouseButton) {
        this.current_mode.onMouseDown(button);
    }

    public onMouseUp(button: MouseButton) {
        this.current_mode.onMouseUp(button);
    }

    public onMouseClick(button: MouseButton) {
        this.current_mode.onMouseClick(button);
    }

	//================================ Getters ================================

    public getCurrentModeType(): ModeType {
        return this.current_mode_type;
    }

    public getCreateModeTypes(): ModeType[] {
        return [ModeType.CREATE_POINTMASS, ModeType.CREATE_RIGID_CONSTRAINT];
    }  

	//================================ Reset ================================

    public reset() {
        this.toMoveMode();
    }
}