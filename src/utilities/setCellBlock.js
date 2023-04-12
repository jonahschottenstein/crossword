export const setCellBlock = (e, setCells) => {
	const targetIndex = Number(e.target.dataset.index);
	setCells((prevState) => {
		const newState = prevState.map((cell) => {
			if (cell.index === targetIndex) {
				return {
					...cell,
					isBlackSquare: !cell.isBlackSquare,
					letter: "",
					isShaded: false,
				};
			} else {
				return cell;
			}
		});
		return newState;
	});
};
