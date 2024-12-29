import { useEffect, useState } from "react";
import LoopManager from "../../manager/LoopManager";
import IconButton from "../common/IconButton";

export interface SimulationControlsProps {
    onRun: () => void;
    onPause: () => void;
    onStep: () => void;
    onSave: () => void;
}

export default function SimulationControls({
    onRun,
    onStep,
    onPause,
    onSave,
}: SimulationControlsProps) {
    const tooltip_direction = "right";
    const [is_running, setIsRunning] = useState(false);

    const onRunPause = () => {
        if (is_running) setIsRunning(false);
        else setIsRunning(true);
    };

    useEffect(() => {
        if (is_running) onRun();
        else onPause();
    }, [is_running]);

    useEffect(() => {
        setIsRunning(LoopManager.isRunning());
    }, [LoopManager.isRunning()]);

    return <div className="flex flex-col p-2 space-y-2 rounded-xl prm-bg">
        <IconButton 
            desc={is_running ? "Pause" : "Run"}
            icon_class={is_running ? "fa-solid fa-pause" : "fa-solid fa-play"} 
            onClick={onRunPause} 
            direction={tooltip_direction} />          
        <IconButton 
            desc="Step" 
            icon_class="fa-solid fa-step-forward" 
            onClick={onStep} 
            disabled={is_running} 
            direction={tooltip_direction} />
        <IconButton 
            desc="Save" 
            icon_class="fa-solid fa-save" 
            onClick={onSave} 
            direction={tooltip_direction} />
    </div>
}
