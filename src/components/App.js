import "../App.css";
import React, { useEffect, useState } from "react";
import { setDirectionOnClick } from "../utilities/direction.js";
import { setSelectedCell } from "../utilities/setSelectedCell.js";
import { setCellBlock } from "../utilities/setCellBlock.js";
import { setSymmetricalCellBlock } from "../utilities/setSymmetricalCellBlock.js";
import { setCellNumbers } from "../utilities/setCellNumbers.js";
import { setClues } from "../utilities/setClues.js";
import { handleLetterKey } from "../utilities/letters.js";
import { removeCellSelection } from "../utilities/removeCellSelection.js";
import { createCellObjects } from "../utilities/createCellObjects.js";
import { handleArrowKeys } from "../utilities/arrows";
import { handleTabKey } from "../utilities/tab.js";
import { handleBackspaceKey } from "../utilities/backspace.js";
import { BoardAndSettings } from "./BoardAndSettings";
import {
	getClueProps,
	scrollToLi,
	selectCellElementOnLiClick,
} from "../utilities/clueListItems";
import { cellHasLetter, getNextDirection } from "../utilities/helpers";
import { Dashboard } from "./Dashboard";
import {
	fetchWordList,
	getWordMatches,
	isMatchable,
	areMatchesLeft,
	getFirst100Matches,
	getNext100Matches,
	getMatchesFromTable,
	fillWord,
} from "../utilities/fill";
import { getWordObj } from "../utilities/words";

export default function App() {
	const [direction, setDirection] = useState("across");
	const [cells, setCells] = useState(createCellObjects());
	const [cellBlockSettings, setCellBlockSettings] = useState({
		cellBlockIsChecked: false,
		symmetryIsChecked: true,
	});
	const [visibleDashPage, setVisibleDashPage] = useState("stats");
	const [wordMatches, setWordMatches] = useState({
		current: null,
		hasMatchesLeft: false,
	});

	useEffect(() => {
		const startFetching = async () => {
			setWordMatches({
				current: null,
				hasMatchesLeft: false,
			});

			const { selectedWordObj } = getWordObj(direction, cells);
			const wordLength = selectedWordObj?.word.length;

			if (!selectedWordObj || wordLength < 3) return;
			if (!ignore) {
				const wordList = await fetchWordList(selectedWordObj?.word);
				const newWordMatches = await getWordMatches(
					selectedWordObj?.word,
					wordList
				);
				const matchable = isMatchable(selectedWordObj.word);
				const currentWordList = matchable ? newWordMatches : wordList;
				const firstMatches = getFirst100Matches(currentWordList);
				const hasMatchesLeft = areMatchesLeft(
					currentWordList,
					firstMatches.length
				);
				setWordMatches({
					current: firstMatches,
					hasMatchesLeft: hasMatchesLeft,
				});
			}
		};

		let ignore = false;
		startFetching();
		return () => {
			ignore = true;
		};
	}, [direction, cells]);

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

	const handleLiClick = (e) => {
		selectCellElementOnLiClick(e, direction, setDirection, cells);
	};

	const showMoreWordMatches = async () => {
		const { selectedWordObj } = getWordObj(direction, cells);
		const wordList = await fetchWordList(selectedWordObj?.word);
		const newWordMatches = await getWordMatches(
			selectedWordObj?.word,
			wordList
		);
		const tableLength = getMatchesFromTable().length;
		const next100Matches = getNext100Matches(newWordMatches, tableLength);
		const currentMatches = [...wordMatches.current, ...next100Matches];
		const hasMatchesLeft = areMatchesLeft(
			newWordMatches,
			currentMatches.length
		);

		setWordMatches({
			current: currentMatches,
			hasMatchesLeft: hasMatchesLeft,
		});
	};

	const handleMatchClick = (e) => {
		fillWord(e, direction, cells, setCells);

		if (e.target.matches(".show-more-button")) {
			showMoreWordMatches();
		}
	};

	const handleKeyDown = (e) => {
		handleArrowKeys(e, direction, setDirection, cells);
		handleTabKey(e, direction, setDirection, cells);
		handleLetterKey(e, direction, setDirection, cells, setCells);
		handleBackspaceKey(e, direction, setDirection, cells, setCells);
	};

	const handleToggleChange = (e) => {
		removeCellSelection(setCells);

		const name = e.target.name;
		let settings = { ...cellBlockSettings };
		settings[name] = !cellBlockSettings[name];
		setCellBlockSettings(settings);
	};

	const handleChange = (e) => {
		handleToggleChange(e);
	};

	const handleDashChange = (e) => {
		setVisibleDashPage(e.target.value);
	};

	scrollToLi(direction, cells);
	scrollToLi(getNextDirection(direction), cells);

	return (
		<div className="App">
			<BoardAndSettings
				direction={direction}
				cells={cells.slice()}
				onClick={(e) => handleClick(e)}
				onKeyDown={handleKeyDown}
				cellBlockIsChecked={cellBlockSettings.cellBlockIsChecked}
				symmetryIsChecked={cellBlockSettings.symmetryIsChecked}
				onChange={handleChange}
			/>
			<Dashboard
				direction={direction}
				cells={cells.slice()}
				visibleDashPage={visibleDashPage}
				onChange={handleDashChange}
				acrossClueNumbers={cells
					.filter(
						(cell) => cell.isBlackSquare === false && cell.across === true
					)
					.map((cell) => cell.number)}
				downClueNumbers={cells
					.filter((cell) => cell.isBlackSquare === false && cell.down === true)
					.map((cell) => cell.number)}
				clueProps={getClueProps(direction, cells)}
				oppositeClueProps={getClueProps(getNextDirection(direction), cells)}
				onClick={(e) => handleLiClick(e)}
				wordMatches={wordMatches}
				onMatchClick={(e) => handleMatchClick(e)}
			/>
		</div>
	);
}
