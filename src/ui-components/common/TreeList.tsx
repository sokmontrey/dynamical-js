interface TreeListProps {
    title: string;
    items: string[];
    focused_items: string[];
    onItemClicked: (index: number) => void;
	className?: string;
}

export default function TreeList({
    title,
    items,
    focused_items,
    onItemClicked,
	className = "",
}: TreeListProps) {
	return <div className={`flex flex-col mt-4 ${className}`}>
		<div className="flex items-center pl-2">
			<div className="w-[28px] flex items-center justify-center mr-1">
				<div className="w-[10px] h-[10px] acc-bg rounded-[3px]"></div>
			</div>
			<p>{title}</p>
		</div>
		<div className="flex flex-col">
			{items.map((item, index) => {
				const is_focused = focused_items.includes(item);
				return <button 
					key={`${item}-${index}`}
					onClick={() => onItemClicked(index)} 
					className={`group flex items-center text-left hover:bg-[var(--sur-color)] rounded-tr-lg rounded-br-lg pl-2 transition-all duration-100 hover:opacity-100 ${is_focused ? "bg-[var(--sur-color)]" : ""}`}
					style={{
						color: is_focused ? "var(--acc-color)" : "var(--sec-txt-color)",
						opacity: is_focused ? 1 : 0.5,
					}}
				>
					<div className="w-[28px] flex items-center justify-center mr-1">
						<div className="group-hover:bg-[var(--acc-color)] w-[2px] h-[30px] group-hover:opacity-100 transition-all duration-100"
							style={{
								backgroundColor: is_focused ? "var(--acc-color)" : "var(--txt-color)",
								opacity: is_focused ? 1 : 0.1,
							}}
						></div>
					</div>
					{item}
				</button>
			})}
		</div>
	</div>;
}