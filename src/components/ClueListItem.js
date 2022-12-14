export const ClueListItem = (props) => {
	return (
		<li className="clue-list-item">
			<span className="clue-label">{props.clueLabel}</span>
			<span className="clue-text">{props.clueText}</span>
		</li>
	);
};

ClueListItem.defaultProps = { clueText: "Clue text" };
