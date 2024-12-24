export interface SimulationControlsProps {
    onRun: () => void;
    onPause: () => void;
    onStep: () => void;
    onReset: () => void;
    onSave: () => void;
}

export default function SimulationControls({
    onRun,
    onStep,
    onPause,
    onReset,
    onSave
}: SimulationControlsProps) {
    return (
        <div>
            <button onClick={onRun}>Run</button>
            <button onClick={onPause}>Pause</button>
            <button onClick={onStep}>Step</button>
            <button onClick={onReset}>Reset</button>
            <button onClick={onSave}>Save</button>
        </div>
    );
}
