import ModeManager from "../mode/ModeManager";
import SelectButton from "./SelectButton";

export default function ToolBar() {
	return <div>
		<button onClick={() => ModeManager.toMoveMode()}>
			Move
		</button>
		<SelectButton options={ModeManager.getCreateModeTypes()}
					  onSelect={mode => ModeManager.toCreateMode(mode)}
		></SelectButton>
	</div>;
}