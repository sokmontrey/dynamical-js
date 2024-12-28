import CreatePointMassMode from "./CreatePointMassMode.ts";
import CreateRigidConstraintMode from "./CreateRigidConstraintMode.ts";
import CreateCircularKinematicMode from "./CreateCircularKinematicMode.ts";
import MoveMode from "./MoveMode.ts";
import Mode from "./Mode.ts";
import { MouseButton } from "../manager/InputManager.ts";

export enum ModeType {
    MOVE = "Move",
    CREATE_POINTMASS = "Create Point Mass",
    CREATE_RIGID_CONSTRAINT = "Create Rigid Constraint",
    CREATE_CIRCULAR_KINEMATIC = "Create Circular Kinematic",
}

export default class ModeManager {
    private static current_mode_type: ModeType;
    private static current_mode: Mode;
    private static initialized: boolean = false;
    private static on_mode_change: (mode_type: ModeType) => void = () => {};

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
            case ModeType.CREATE_CIRCULAR_KINEMATIC:
                ModeManager.toMode(new CreateCircularKinematicMode(), ModeType.CREATE_CIRCULAR_KINEMATIC);
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
        ModeManager.on_mode_change(mode_type);
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

    static setOnModeChange(callback: (mode_type: ModeType) => void): void {
        ModeManager.on_mode_change = callback;
    }

    //================================ Getters ================================

    static getCurrentMode(): Mode {
        return ModeManager.current_mode;
    }

    static getCurrentModeType(): ModeType {
        return ModeManager.current_mode_type;
    }

    static getCreateModeTypes(): ModeType[] {
        return [
            ModeType.CREATE_POINTMASS,
            ModeType.CREATE_RIGID_CONSTRAINT,
            ModeType.CREATE_CIRCULAR_KINEMATIC
        ];
    }  

    //================================ Reset ================================

    static reset(): void {
        ModeManager.toMoveMode();
    }
}