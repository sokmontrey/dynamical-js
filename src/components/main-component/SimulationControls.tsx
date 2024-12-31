import LoopManager from "@/manager/LoopManager";
import { useState, useEffect } from "react";
import IconButton from "../common/IconButton";
import NumberInput from "../input/NumberInput";

export interface SimulationControlsProps {
    onRun: () => void;
    onPause: () => void;
    onStep: () => void;
    onRestart: () => void;
    onSubStepsChange: (value: number) => void;
    tooltip_direction: "top" | "right" | "bottom" | "left";
}

export default function SimulationControls({
    onRun,
    onStep,
    onPause,
    onRestart,
    onSubStepsChange,
    tooltip_direction = "bottom",
}: SimulationControlsProps) {
    const [is_running, setIsRunning] = useState(false);
    const [sub_steps, setSubSteps] = useState(LoopManager.getSubSteps());

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

    useEffect(() => {
        onSubStepsChange(sub_steps);
    }, [sub_steps]);

    return <>
        <IconButton 
            desc={is_running ? "Pause" : "Run"}
            icon_class={is_running ? "fa-solid fa-pause" : "fa-solid fa-play"} 
            onClick={onRunPause} 
            direction={tooltip_direction} />          
        <IconButton 
            desc="Restart"
            icon_class="fa-solid fa-arrow-rotate-right" 
            onClick={onRestart} 
            direction={tooltip_direction} />          
        <IconButton 
            desc="Step" 
            icon_class="fa-solid fa-step-forward" 
            onClick={onStep} 
            disabled={is_running} 
            direction={tooltip_direction} />
        <NumberInput 
            min={1}
            label="Sub Steps"
            className="text-xs"
            value={sub_steps}
            onChange={setSubSteps}
        />
    </>
}
