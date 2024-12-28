import BodyManager from "../../manager/BodyManager";
import InputManager from "../../manager/InputManager";
import ModeManager, { ModeType } from "../../manager/ModeManager";
import MoveMode from "../../mode/move-mode/Mode";

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
	const onBodyClicked = (body_id: string) => {
		if (ModeManager.getCurrentModeType() !== ModeType.MOVE)
			ModeManager.toMoveMode();
		const move_mode = ModeManager.getCurrentMode() as MoveMode;
		const body = BodyManager.getById(body_id);
		if (!body) return;
		if (!InputManager.isKeyDown("Shift")) 
			move_mode.resetSelectedBodies();
		move_mode.selectBody(body);
		renderUI();
	};

	return <div>
		<p>Body Tree</p>
		<div>
			{body_ids.map(id => 
				<button key={id} onClick={() => onBodyClicked(id)}
				style={{
					backgroundColor: selected_body_ids.includes(id) ? "blue" : "white",
				}} >
					{id}
				</button>
			)}
		</div>
	</div>;
}