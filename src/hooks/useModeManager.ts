import ModeManager, { ModeType } from "@/manager/ModeManager";
import MoveMode from "@/mode/move-mode/Mode";
import { useState, useCallback } from "react";

export default function useModeManagement() {
    const [mode, setMode] = useState<ModeType>(ModeType.MOVE);
    const [selected_body_ids, setSelectedBodyIds] = useState<string[]>([]);

    const initializeModeManager = useCallback(() => {
        ModeManager.init();
        ModeManager.setOnModeChange(new_mode => {
            setMode(new_mode);
            setSelectedBodyIds([]);
            if (new_mode !== ModeType.MOVE) return;
            const move_mode = ModeManager.getCurrentMode() as MoveMode;
            setSelectedBodyIds([]);
            move_mode.setOnSelectionChange((selected_bodies) => {
                const selected_body_ids = Array.from(selected_bodies)
                    .map(body => body.getId() ?? "Unknown");
                setSelectedBodyIds(selected_body_ids);
            });
        });
        ModeManager.toMoveMode();
    }, []);

    return {
        mode,
        selected_body_ids,
        initializeModeManager
    };
}