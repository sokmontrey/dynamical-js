import TreeList from "../common/TreeList";

export interface State {
    state: any,
    id: string,
}

interface StateLogProps {
    states: State[],
    onStateSelected: (index: number) => void,
    current_state: State,
}

export default function StateLog({
    states,
    current_state,
    onStateSelected,
}: StateLogProps) {
	return <TreeList
		className="flex-1"
		title="State Log"
		items={states.map(({ id }) => `${id}`)}
		focused_items={[current_state.id]}
		onItemClicked={onStateSelected}
	/>;
}