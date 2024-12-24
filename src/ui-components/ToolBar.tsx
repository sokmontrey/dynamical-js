import ModeManager, { ModeType } from "../mode/ModeManager";
import SelectButton from "./SelectButton";

export interface ToolBarProps {
	onReset: () => void;
	onSave: () => void;
    onModeChange: (mode: ModeType) => void;
    onRun: () => void;
    onPause: () => void;
	onStep: () => void;
}

export default function ToolBar({ 
    onReset, 
    onSave,
    onModeChange,
    onRun,
    onPause,
	onStep,
}: ToolBarProps) {
	return <>
		<button onClick={onRun}>Run</button>
		<button onClick={onPause}>Pause</button>
		<button onClick={onStep}>Step</button>
		<button onClick={onReset}>Reset</button>
		<button onClick={onSave}>Save</button>
		<button onClick={() => onModeChange(ModeType.MOVE)}>
			Move
		</button>
		<SelectButton options={ModeManager.getCreateModeTypes()}
					  onSelect={(mode: ModeType) => onModeChange(mode)}
		></SelectButton>
	</>;
}