import { useState } from "react";

interface StateLogProps {
    states: any[],
    onStateSelected: (index: number) => void,
}

export default function StateLog({
    states,
    onStateSelected,
}: StateLogProps) {
	return (
		<div>
			{states.map((_, index) => (
				<div key={index}>
					<button onClick={() => onStateSelected(index)}>Load State {index}</button>
				</div>
			))}
		</div>
	);
}