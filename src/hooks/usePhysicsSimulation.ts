import { useState } from "react";
import LoopManager from "../manager/LoopManager";
import BodyManager from "../manager/BodyManager";
import ModeManager from "../manager/ModeManager";

export default function usePhysicsSimulation(
    initial_state: any
) {
    const [states, setStates] = useState<any[]>([{
        id: `0 ${new Date().toLocaleTimeString()}`,
        state: initial_state
    }]);
    const [body_ids, setBodyIds] = useState<string[]>([]);

    const update = (dt: number, _sub_steps: number) => {
        const bodies = BodyManager.getAllBodies();
        bodies.sort((a, b) => a.getRank() - b.getRank());
        bodies.forEach(x => x.update(dt));
    };

    const addState = (state: any) => {
        setStates([...states, {
            id: `${states.length} ${new Date().toLocaleTimeString()}`,
            state: state
        }]);
    };

    const resetState = () => {
        setStates([{
            id: `0 ${new Date().toLocaleTimeString()}`,
            state: initial_state
        }]);
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