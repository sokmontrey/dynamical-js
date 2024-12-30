import BodyManager from "../../manager/BodyManager";
import InputManager from "../../manager/InputManager";
import ModeManager, { ModeType } from "../../manager/ModeManager";
import MoveMode from "../../mode/move-mode/Mode";
import TreeList from "../common/TreeList";

export interface BodyTreePanelProps {
	body_ids: string[];
	selected_body_ids: string[];
	renderUI: () => void;
}

export default function BodyTreePanel({ 
	body_ids, 
	selected_body_ids,
	renderUI,
}: BodyTreePanelProps) {
	const onBodyClicked = (index: number) => {
		if (ModeManager.getCurrentModeType() !== ModeType.MOVE)
			ModeManager.toMoveMode();
		const move_mode = ModeManager.getCurrentMode() as MoveMode;
		const body = BodyManager.getById(body_ids[index]);
		if (!body) return;
		if (!InputManager.isKeyDown("Shift")) 
			move_mode.resetSelectedBodies();
		move_mode.selectBody(body);
		renderUI();
	};

	return <TreeList 
		title="Bodies"
		items={body_ids}
		focused_items={selected_body_ids}
		onItemClicked={onBodyClicked}
	/>;
}