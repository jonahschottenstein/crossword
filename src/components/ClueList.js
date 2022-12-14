import { ClueListItem } from "./ClueListItem.js";

export const ClueList = (props) => {
	return (
		<div className="clue-list-wrapper">
			<h3 className="clue-list-title">{props.direction}</h3>
			<ol className="clue-list">
				{props.clueNumbers.map((number) => {
					return (
						<ClueListItem
							key={`${number}-${props.direction}`}
							clueLabel={number}
						/>
					);
				})}
			</ol>
		</div>
	);
};
