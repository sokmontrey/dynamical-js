import { useState } from "react";
import PhysicBodyState from "../core/PhysicBodyState";
import LoopManager from "../manager/LoopManager";
import PhysicBodyManager from "../manager/PhysicBodyManager";
import ModeManager from "../mode/ModeManager";

export default function usePhysicsSimulation(initial_state: PhysicBodyState) {
    const [state, setState] = useState<PhysicBodyState>(initial_state);
    const [body_ids, setBodyIds] = useState<string[]>([]);

    const update = (dt: number, _sub_steps: number) => {
        const bodies = PhysicBodyManager.getAllBodies();
        bodies.sort((a, b) => a.getRank() - b.getRank());
        bodies.forEach(x => x.update(dt));
    };

    const resetState = () => {
        PhysicBodyManager.loadFromState(state);
        ModeManager.reset();
        LoopManager.render();
    };

    const saveState = () => {
        setState(PhysicBodyManager.toState());
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