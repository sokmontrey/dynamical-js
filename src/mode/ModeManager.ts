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
    private static instance: ModeManager;

    private current_mode_type!: ModeType;
    private current_mode!: Mode;

    private constructor() {
        this.toMoveMode();
    }

    static getInstance(): ModeManager {
        if (!ModeManager.instance) {
            ModeManager.instance = new ModeManager();
        }
        return ModeManager.instance;
    }

    //================================ Mode Management ================================ 

    toCreateMode(create_mode: ModeType): void {
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

    toMoveMode(): void {
        this.toMode(new MoveMode(), ModeType.MOVE);
    }

    private toMode(mode: Mode, mode_type: ModeType): void {
        this.current_mode = mode;
        this.current_mode_type = mode_type;
    }

    //================================ Mouse Events ================================

    onMouseMove(): void {
        this.current_mode.onMouseMove();
    }

    onMouseDown(button: MouseButton): void {
        this.current_mode.onMouseDown(button);
    }

    onMouseUp(button: MouseButton): void {
        this.current_mode.onMouseUp(button);
    }

    onMouseClick(button: MouseButton): void {
        this.current_mode.onMouseClick(button);
    }

    //================================ Getters ================================

    getCurrentModeType(): ModeType {
        return this.current_mode_type;
    }

    getCreateModeTypes(): ModeType[] {
        return [ModeType.CREATE_POINTMASS, ModeType.CREATE_RIGID_CONSTRAINT];
    }  

    //================================ Reset ================================

    reset(): void {
        this.toMoveMode();
    }
}