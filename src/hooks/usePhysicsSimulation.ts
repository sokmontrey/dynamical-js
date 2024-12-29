import { useState } from "react";
import LoopManager from "../manager/LoopManager";
import BodyManager from "../manager/BodyManager";
import ModeManager from "../manager/ModeManager";

export default function usePhysicsSimulation(
    initial_state: any
) {
    const [states, setStates] = useState<any[]>([initial_state]);
    const [body_ids, setBodyIds] = useState<string[]>([]);

    const update = (dt: number, _sub_steps: number) => {
        const bodies = BodyManager.getAllBodies();
        bodies.sort((a, b) => a.getRank() - b.getRank());
        bodies.forEach(x => x.update(dt));
    };

    const addState = (state: any) => {
        setStates([...states, state]);
    };

    const resetState = () => {
        setStates([initial_state]);
        ModeManager.reset();
        LoopManager.render();
    };

    const saveState = () => {
        addState(BodyManager.toJSON());
    };

    return {
        states,
        body_ids,
        setBodyIds,
        update,
        resetState,
        saveState
    };
}