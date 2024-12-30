import ModeManager, { ModeType } from "../../manager/ModeManager";
import IconButton from "../common/IconButton";
import SelectButton from "../input/SelectButton";

interface ToolBarProps {
	tooltip_direction: "top" | "right" | "bottom" | "left";
}

export default function ToolBar({
	tooltip_direction = "bottom",
}: ToolBarProps) {
	const current_mode = ModeManager.getCurrentModeType();
	const create_modes = [
		{ type: ModeType.CREATE_POINTMASS, desc: "Point Mass", icon_class: "fa-solid fa-circle" },
		{ type: ModeType.CREATE_RIGID_CONSTRAINT, desc: "Rigid Constraint", icon_class: "fa-solid fa-slash" },
		{ type: ModeType.CREATE_CIRCULAR_KINEMATIC, desc: "Circular Kinematic", icon_class: "fa-solid fa-circle-dot" }
	];

	return <>
		<IconButton 
			focused={current_mode === ModeType.MOVE}
			desc="Move" 
			icon_class="fa-solid fa-arrow-pointer" 
			onClick={() => ModeManager.toMoveMode()} 
			direction={tooltip_direction} />
		<SelectButton 

			focused={create_modes.some(mode => mode.type === current_mode)}
			options={create_modes}
			onSelect={mode_type => ModeManager.toCreateMode(mode_type)}
		></SelectButton>
	</>;
}