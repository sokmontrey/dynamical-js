import IconButton from "../common/IconButton";

export interface StateToolsProps {
	onSave: () => void;
	onImport: () => void;
	onExport: () => void;
	tooltip_direction: "top" | "right" | "bottom" | "left";
}

export default function StateTools({
	onSave,
	onImport,
	onExport,
	tooltip_direction = "top",
}: StateToolsProps) {
	return <>
        <IconButton 
            desc="Snapshot of current state" 
            icon_class="fa-solid fa-camera" 
            onClick={onSave} 
            direction={tooltip_direction} />
        <IconButton 
            desc="Import state from JSON file" 
            icon_class="fa-solid fa-file-import" 
            onClick={onImport} 
            direction={tooltip_direction} />
		<IconButton 
            desc="Export selected state" 
            icon_class="fa-solid fa-file-export" 
            onClick={onExport} 
            direction={tooltip_direction} />
	</>;
}