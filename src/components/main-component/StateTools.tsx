import IconButton from "../common/IconButton";

export interface StateToolsProps {
	onSave: () => void;
	onImport: (json_content: string) => void;
	onExport: () => void;
	tooltip_direction: "top" | "right" | "bottom" | "left";
}

export default function StateTools({
	onSave,
	onImport,
	onExport,
	tooltip_direction = "top",
}: StateToolsProps) {
	const handleImport = async () => {
		const file_input = document.createElement('input');
		file_input.type = 'file';
		file_input.accept = '.json';
		
		file_input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			try {
				const content = await file.text();
				onImport(content);
			} catch (error) {
                //TODO: error message handling
				console.error('Error reading file:', error);
			}
		};
		file_input.click();
	};

	return <>
        <IconButton 
            desc="Snapshot of current state" 
            icon_class="fa-solid fa-camera" 
            onClick={onSave} 
            direction={tooltip_direction} />
        <IconButton 
            desc="Import state from JSON file" 
            icon_class="fa-solid fa-file-import" 
            onClick={handleImport} 
            direction={tooltip_direction} />
		<IconButton 
            desc="Export selected state" 
            icon_class="fa-solid fa-file-export" 
            onClick={onExport} 
            direction={tooltip_direction} />
	</>;
}