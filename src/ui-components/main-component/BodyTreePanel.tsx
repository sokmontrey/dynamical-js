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

	return <div className="flex flex-col mt-8">
		<div className="flex items-center pl-2">
			<div className="w-[28px] flex items-center justify-center mr-1">
				<div className="w-[10px] h-[10px] acc-bg rounded-[3px]"></div>
			</div>
			<p>Bodies</p>
		</div>
		<div className="flex flex-col">
			{body_ids.map(id => <button 
				key={id}
				onClick={() => onBodyClicked(id)} 
				className="group flex items-center text-left hover:bg-[var(--sur-color)] rounded-tr-lg rounded-br-lg pl-2 transition-all duration-100 hover:opacity-100"
				style={{
					color: selected_body_ids.includes(id) ? "var(--acc-color)" : "var(--sec-txt-color)",
					opacity: selected_body_ids.includes(id) ? 1 : 0.5,
				}}
			>
				<div className="w-[28px] flex items-center justify-center mr-1">
					<div className="group-hover:bg-[var(--acc-color)] w-[2px] h-[40px] group-hover:opacity-100 transition-all duration-100"
						style={{
							backgroundColor: selected_body_ids.includes(id) ? "var(--acc-color)" : "var(--txt-color)",
							opacity: selected_body_ids.includes(id) ? 1 : 0.1,
						}}
					></div>
				</div>
				{id}
			</button>)}
		</div>
	</div>;
}