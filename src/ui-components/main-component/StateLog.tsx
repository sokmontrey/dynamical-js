import TreeList from "../common/TreeList";

interface StateLogProps {
    states: {
        timestamp: string,
        state: any,
    }[],
    onStateSelected: (index: number) => void,
}

export default function StateLog({
    states,
    onStateSelected,
}: StateLogProps) {
	return <TreeList
		className="flex-1"
		title="Changes"
		items={states.map(({ timestamp }) => `${timestamp}`)}
		focused_items={[]}
		onItemClicked={onStateSelected}
	/>;
}