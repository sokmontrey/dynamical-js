export interface BodyTreePanelProps {
	body_ids: string[];
	onBodySelected: (body_id: string) => void;
}

export default function BodyTreePanel({ 
	body_ids, 
	onBodySelected 
}: BodyTreePanelProps) {
	return <div>
		<p>Body Tree</p>
		<ul>
			{body_ids.map(id => 
				<li key={id}>
					<button onClick={() => onBodySelected(id)}>
						{id}
					</button>
				</li>)}
		</ul>
	</div>;
}