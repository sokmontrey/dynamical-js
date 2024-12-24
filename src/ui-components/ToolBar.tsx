import ModeManager, { ModeType } from "../mode/ModeManager";
import SelectButton from "./SelectButton";

export interface ToolBarProps {
    onModeChange: (mode: ModeType) => void;
}

export default function ToolBar({ 
    onModeChange,
}: ToolBarProps) {
	return <div>
		<button onClick={() => onModeChange(ModeType.MOVE)}>
			Move
		</button>
		<SelectButton options={ModeManager.getCreateModeTypes()}
					  onSelect={(mode: ModeType) => onModeChange(mode)}
		></SelectButton>
	</div>;
}