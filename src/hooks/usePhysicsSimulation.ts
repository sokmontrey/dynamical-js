import { useState } from "react";
import BodyState from "../core/BodyState";
import LoopManager from "../manager/LoopManager";
import BodyManager from "../manager/BodyManager";
import ModeManager from "../manager/ModeManager";

export default function usePhysicsSimulation(
    initial_state: BodyState, 
) {
    const [state, setState] = useState<BodyState>(initial_state);
    const [body_ids, setBodyIds] = useState<string[]>([]);

    const update = (dt: number, _sub_steps: number) => {
        const bodies = BodyManager.getAllBodies();
        bodies.sort((a, b) => a.getRank() - b.getRank());
        bodies.forEach(x => x.update(dt));
    };

    const resetState = () => {
        BodyManager.loadFromState(state);
        ModeManager.reset();
        LoopManager.render();
    };

    const saveState = () => {
        setState(BodyManager.toState());
    };

    return {
        state,
        body_ids,
        setBodyIds,
        update,
        resetState,
        saveState
    };
}