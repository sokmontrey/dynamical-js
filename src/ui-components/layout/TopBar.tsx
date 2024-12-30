import LoopManager from "../../manager/LoopManager";
import SimulationControls from "../main-component/SimulationControls";
import ToolBar from "../main-component/ToolBar";

interface TopBarProps {
    onSave: () => void;
}

export default function TopBar({
    onSave,
}: TopBarProps) {
    return <div className="flex flex-row space-x-2 p-4">
		<div className="tool-container">
			<SimulationControls 
				tooltip_direction="bottom"
				onRun={() => LoopManager.run()}
				onPause={() => LoopManager.pause()}
				onStep={() => !LoopManager.isRunning() ? LoopManager.step() : null }
				onSave={onSave}
			/>
		</div>
		<div className="tool-container">
			<ToolBar 
				tooltip_direction="bottom"
			/>
		</div>
    </div>
}