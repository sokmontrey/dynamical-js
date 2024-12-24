import { useCallback, useState } from "react";
import ModeManager, { ModeType } from "../mode/ModeManager";
import MoveMode from "../mode/MoveMode";

export default function useModeManagement() {
    const [mode, setMode] = useState<ModeType>(ModeType.MOVE);
    const [selected_body_ids, setSelectedBodyIds] = useState<string[]>([]);

    const initializeModeManager = useCallback(() => {
        ModeManager.init();
        ModeManager.setOnModeChange(new_mode => {
            setMode(new_mode);
            if (new_mode !== ModeType.MOVE) return;
            const move_mode = ModeManager.getCurrentMode() as MoveMode;
            move_mode.setOnSelectionChange(setSelectedBodyIds);
        });
        ModeManager.toMoveMode();
    }, []);

    return {
        mode,
        selected_body_ids,
        initializeModeManager
    };
}