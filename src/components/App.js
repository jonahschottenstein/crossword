import "../App.css";
import React, { useState } from "react";
import { setDirectionOnClick } from "../utilities/direction.js";
import { setSelectedCell } from "../utilities/setSelectedCell.js";
import { setCellBlock } from "../utilities/setCellBlock.js";
import { setSymmetricalCellBlock } from "../utilities/setSymmetricalCellBlock.js";
import { setCellNumbers } from "../utilities/setCellNumbers.js";
import { setClues } from "../utilities/setClues.js";
import { setCellLetter } from "../utilities/setCellLetter.js";
import { createCellObjects } from "../utilities/createCellObjects.js";
import { Board } from "./Board.js";
import { CellBlockSettings } from "./CellBlockSettings.js";
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
		cellBlockIsChecked: false,
		symmetryIsChecked: true,
	});

	const handleClick = (e) => {
		if (cellBlockSettings.cellBlockIsChecked) {
			setCellBlock(e, setCells);
			cellBlockSettings.symmetryIsChecked &&
				setSymmetricalCellBlock(e, cells, setCells);
			setCellNumbers(setCells);
			setClues(setCells);
		} else {
			setDirectionOnClick(e, cells, setDirection);
			setSelectedCell(e, setCells);
		}
	};

	const handleKeyDown = (e) => {
		setCellLetter(e, cells, setCells);
		handleArrowKeyDirectionChange(e, direction, setDirection);
		handleArrowKeyMovement(e, direction, cells);
		handleTabDirectionChange(e, direction, setDirection, cells);
		handleTabMovement(e, direction, cells);
	};

	const removeCellSelection = (cellBlockIsChecked) => {
		if (cellBlockIsChecked === false) return;
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
		removeCellSelection(settings.cellBlockIsChecked);
		setCellBlockSettings(settings);
	};

	const handleChange = (e) => {
		handleToggleChange(e);
	};

	return (
		<div className="App">
			<CellBlockSettings
				cellBlockIsChecked={cellBlockSettings.cellBlockIsChecked}
				symmetryIsChecked={cellBlockSettings.symmetryIsChecked}
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
