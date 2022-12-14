import "../App.css";
import React, { useState } from "react";
import { createCellObjects } from "../utilities/createCellObjects.js";
import { Board } from "./Board.js";
import { CellBlockSettings } from "./CellBlockSettings.js";
import { getNumberedCells, isAcross, isDown } from "../utilities/numbers.js";
import { ClueListsContainer } from "./ClueListsContainer";
import {
	handleArrowKeyDirectionChange,
	handleArrowKeyMovement,
} from "../utilities/arrows";
import {
	handleTabDirectionChange,
	handleTabMovement,
} from "../utilities/tab.js";

export default function App() {
	const [direction, setDirection] = useState("across");
	const [cells, setCells] = useState(createCellObjects());
	const [cellBlockSettings, setCellBlockSettings] = useState({
		cellBlockInput: false,
		symmetryInput: true,
	});

	const setPuzzleDirection = (e) => {
		if (cellBlockSettings.cellBlockInput === true) return;
		const selectedCellIndex = cells
			.slice()
			.findIndex((cell) => cell.isSelected);
		const targetIndex = Number(e.target.dataset.index);
		const selectedCellIsClicked = selectedCellIndex === targetIndex;

		if (!selectedCellIsClicked) return;
		setDirection((d) => (d === "across" ? "down" : "across"));
	};

	const setSelectedCell = (e) => {
		if (cellBlockSettings.cellBlockInput === true) return;
		if (e.target.classList.contains("cell-block")) return;

		const targetIndex = Number(e.target.dataset.index);
		setCells((prevState) => {
			const newState = prevState.map((cell) => {
				if (cell.index === targetIndex) {
					return { ...cell, isSelected: true };
				} else {
					return { ...cell, isSelected: false };
				}
			});
			return newState;
		});
	};

	const setCellBlock = (e) => {
		if (cellBlockSettings.cellBlockInput === false) return;

		const targetIndex = Number(e.target.dataset.index);
		setCells((prevState) => {
			const newState = prevState.map((cell) => {
				if (cell.index === targetIndex) {
					return { ...cell, isBlackSquare: !cell.isBlackSquare };
				} else {
					return cell;
				}
			});
			return newState;
		});
	};

	const setSymmetricalCellBlock = (e) => {
		/* Not sure if when targetCell is (not) a cellBlock and symmetricalCell is the opposite if it should toggle both or set them to be the same first. */
		if (cellBlockSettings.symmetryInput === false) return;
		if (cellBlockSettings.cellBlockInput === false) return;

		const numberOfCells = cells.length;
		const lastCellIndex = numberOfCells - 1;
		const centerCellIndex = Math.floor(numberOfCells / 2);
		const targetIndex = Number(e.target.dataset.index);
		const symmetricalCellIndex = lastCellIndex - targetIndex;

		if (targetIndex !== centerCellIndex) {
			setCells((prevState) => {
				const newState = prevState.map((cell) => {
					if (cell.index === symmetricalCellIndex) {
						return { ...cell, isBlackSquare: !cell.isBlackSquare };
					} else {
						return cell;
					}
				});
				return newState;
			});
		}
	};

	const setCellNumbers = () => {
		if (cellBlockSettings.cellBlockInput === false) return;

		setCells((prevState) => {
			const numberedCells = getNumberedCells(prevState);
			const newState = prevState.map((cell) => {
				if (numberedCells.includes(cell)) {
					return { ...cell, number: numberedCells.indexOf(cell) + 1 };
				} else {
					return { ...cell, number: null };
				}
			});
			return newState;
		});
	};

	const setClues = () => {
		if (cellBlockSettings.cellBlockInput === false) return;

		setCells((prevState) => {
			const newState = prevState.map((cell, index, array) => {
				if (isAcross(array, cell) && isDown(array, cell)) {
					return { ...cell, across: true, down: true };
				} else if (isAcross(array, cell) && !isDown(array, cell)) {
					return { ...cell, across: true, down: false };
				} else if (!isAcross(array, cell) && isDown(array, cell)) {
					return { ...cell, across: false, down: true };
				} else {
					return { ...cell, across: false, down: false };
				}
			});
			return newState;
		});
	};

	const handleClick = (e) => {
		setPuzzleDirection(e);
		setSelectedCell(e);
		setCellBlock(e);
		setSymmetricalCellBlock(e);
		setCellNumbers(e);
		setClues();
	};

	const setCellLetter = (e) => {
		const entryIsValid = (e) =>
			!e.metaKey && !e.altKey && !e.ctrlKey && /\b[A-Za-z0-9]{1}\b/.test(e.key);
		if (!entryIsValid(e)) return;

		const getSelectedCell = (cell) => cell.isSelected === true;
		const selectedCellIndex = cells.findIndex(getSelectedCell);

		setCells((prevState) => {
			const newState = prevState.map((cell) => {
				if (cell.index === selectedCellIndex) {
					return { ...cell, letter: e.key.toUpperCase() };
				} else {
					return cell;
				}
			});
			return newState;
		});
	};

	const handleKeyDown = (e) => {
		setCellLetter(e);
		handleArrowKeyDirectionChange(e, direction, setDirection);
		handleArrowKeyMovement(e, direction, cells);
		handleTabDirectionChange(e, direction, setDirection, cells);
		handleTabMovement(e, direction, cells);
	};

	const removeCellSelection = (cellBlockInput) => {
		if (cellBlockInput === false) return;
		setCells((prevState) => {
			const newState = prevState.map((cell) => {
				if (cell.isSelected) {
					return { ...cell, isSelected: false };
				} else {
					return { ...cell };
				}
			});
			return newState;
		});
	};

	const handleToggleChange = (e) => {
		const name = e.target.name;
		let settings = { ...cellBlockSettings };
		settings[name] = !cellBlockSettings[name];
		removeCellSelection(settings.cellBlockInput);
		setCellBlockSettings(settings);
	};

	const handleChange = (e) => {
		handleToggleChange(e);
	};

	return (
		<div className="App">
			<CellBlockSettings
				cellBlockInput={cellBlockSettings.cellBlockInput}
				symmetryInput={cellBlockSettings.symmetryInput}
				onChange={handleChange}
			/>
			<Board
				direction={direction}
				cells={cells.slice()}
				onClick={(e) => handleClick(e)}
				onKeyDown={handleKeyDown}
			/>
			<ClueListsContainer
				acrossClueNumbers={cells
					.filter(
						(cell) => cell.isBlackSquare === false && cell.across === true
					)
					.map((cell) => cell.number)}
				downClueNumbers={cells
					.filter((cell) => cell.isBlackSquare === false && cell.down === true)
					.map((cell) => cell.number)}
			/>
		</div>
	);
}
