import CreatePointMassMode from "./CreatePointMassMode.ts";
import CreateRigidConstraintMode from "./CreateRigidConstraintMode.ts";
import MoveMode from "./MoveMode.ts";
import Mode from "./Mode.ts";
import { MouseButton } from "../core/InputManager.ts";

export enum ModeType {
    MOVE = "Move",
    CREATE_POINTMASS = "CreatePointMass",
    CREATE_RIGID_CONSTRAINT = "CreateRigidConstraint",
}

export default class ModeManager {
    private static current_mode_type!: ModeType;
    private static current_mode!: Mode;
    private static initialized: boolean = false;

    private constructor() {} // Prevent instantiation

    static init(): void {
        if (ModeManager.initialized) return;
        ModeManager.initialized = true;
        ModeManager.toMoveMode();
    }

    //================================ Mode Management ================================ 

    static toCreateMode(create_mode: ModeType): void {
        switch (create_mode) {
            case ModeType.CREATE_POINTMASS:
                ModeManager.toMode(new CreatePointMassMode(), ModeType.CREATE_POINTMASS);
                break;
            case ModeType.CREATE_RIGID_CONSTRAINT:
                ModeManager.toMode(new CreateRigidConstraintMode(), ModeType.CREATE_RIGID_CONSTRAINT);
                break;
            default:
                throw new Error("Invalid create mode");
        }
    }

    static toMoveMode(): void {
        ModeManager.toMode(new MoveMode(), ModeType.MOVE);
    }

    private static toMode(mode: Mode, mode_type: ModeType): void {
        ModeManager.current_mode = mode;
        ModeManager.current_mode_type = mode_type;
    }

    //================================ Mouse Events ================================

    static onMouseMove(): void {
        ModeManager.current_mode.onMouseMove();
    }

    static onMouseDown(button: MouseButton): void {
        ModeManager.current_mode.onMouseDown(button);
    }

    static onMouseUp(button: MouseButton): void {
        ModeManager.current_mode.onMouseUp(button);
    }

    static onMouseClick(button: MouseButton): void {
        ModeManager.current_mode.onMouseClick(button);
    }

    //================================ Getters ================================

    static getCurrentMode(): Mode {
        return ModeManager.current_mode;
    }

    static getCurrentModeType(): ModeType {
        return ModeManager.current_mode_type;
    }

    static getCreateModeTypes(): ModeType[] {
        return [ModeType.CREATE_POINTMASS, ModeType.CREATE_RIGID_CONSTRAINT];
    }  

    //================================ Reset ================================

    static reset(): void {
        ModeManager.toMoveMode();
    }
}