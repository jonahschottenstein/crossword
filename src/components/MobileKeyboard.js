import { handleLetterKey } from "../utilities/letters";
import { handleBackspaceKey } from "../utilities/backspace";
import { getSelectedCell } from "../utilities/helpers";
import { handleTabKey } from "../utilities/tab";
import { handleSpaceKey } from "../utilities/space";

const MobileKeyboardRow = ({
	keys,
	direction,
	setDirection,
	cells,
	setCells,
}) => {
	const handleClick = (e) => {
		const selectedCell = getSelectedCell(cells);

		if (!selectedCell) return;

		handleTabKey(e, direction, setDirection, cells);
		handleLetterKey(e, direction, setDirection, cells, setCells);
		handleBackspaceKey(e, direction, setDirection, cells, setCells);
		handleSpaceKey(e, direction, setDirection);
	};

	return (
		<div className="mobile-keyboard-row">
			{keys.map((key) => {
				return (
					<MobileKeyboardKey key={key} keyVal={key} onClick={handleClick} />
				);
			})}
		</div>
	);
};

const MobileKeyboardKey = ({ keyVal, onClick }) => {
	const className =
		keyVal === "backspace"
			? "mobile-keyboard-key material-icons-outlined"
			: "mobile-keyboard-key";

	return (
		<button className={className} value={keyVal} onClick={onClick}>
			{keyVal}
		</button>
	);
};

export const MobileKeyboard = ({
	direction,
	setDirection,
	cells,
	setCells,
}) => {
	const rows = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Z", "X", "C", "V", "B", "N", "M", "backspace"],
	];
	return (
		<div className="mobile-keyboard">
			{rows.map((row, index) => {
				return (
					<MobileKeyboardRow
						key={row + "-" + index}
						keys={row}
						direction={direction}
						setDirection={setDirection}
						cells={cells}
						setCells={setCells}
					/>
				);
			})}
		</div>
	);
};
