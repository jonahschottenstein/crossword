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
import { getNextDirection } from "../utilities/helpers";
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
	getTopMatches,
	getFilteredMatches,
} from "../utilities/fill";
import { getWordObj } from "../utilities/words";
import {
	handleClueLiTextareaChange,
	handleClueEditButtonClick,
	handleClueTextareaBlur,
	handleClueDoneButtonClick,
	handleClueTextareaFocus,
} from "../utilities/handleClueLi";
import {
	handleClearFill,
	handleFillGrid,
	handleAddBlackSquares,
} from "../utilities/gridHandlers";
import { setClueText } from "../utilities/setClueText";
import { setShadedCell } from "../utilities/setShadedCell";
import { setCircledCell } from "../utilities/setCircledCell";
import { setSymmetricalCellStyle } from "../utilities/setSymmetricalCellStyle";
import { gridOptions } from "../utilities/gridOptions";

export default function App() {
	const [direction, setDirection] = useState("across");
	const [cells, setCells] = useState(createCellObjects());
	const [cellSettings, setCellSettings] = useState({
		cellBlockIsChecked: false,
		symmetryIsChecked: true,
		shadedCellIsChecked: false,
		circleIsChecked: false,
		newPuzzleIsChecked: false,
	});
	const [visibleDashPage, setVisibleDashPage] = useState("stats");
	const [wordMatches, setWordMatches] = useState({
		current: null,
		hasMatchesLeft: false,
	});
	const [matchFilterInput, setMatchFilterInput] = useState("");
	const [isAutofilling, setIsAutofilling] = useState(false);
	const [activeTextarea, setActiveTextarea] = useState(null);

	useEffect(() => {
		// if (visibleDashPage !== "fill") return;
		if (isAutofilling) return;

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
				const totalMatchCount = currentWordList.length;
				// console.log({ totalMatchCount });
				const filteredMatches = getFilteredMatches(
					matchFilterInput,
					currentWordList
				);
				// console.log(filteredMatches);

				// const firstMatches = getFirst100Matches(currentWordList);
				// const hasMatchesLeft = areMatchesLeft(
				// 	currentWordList,
				// 	firstMatches.length
				// );
				const firstMatches = getFirst100Matches(filteredMatches);
				const hasMatchesLeft = areMatchesLeft(
					filteredMatches,
					firstMatches.length
				);
				const topMatches = await getTopMatches(
					currentWordList,
					direction,
					cells
				);
				console.log(topMatches);
				setWordMatches({
					current: firstMatches,
					hasMatchesLeft: hasMatchesLeft,
				});
			}
		};

		let ignore = false;

		const handleBlurOnClick = (e) => {
			if (!activeTextarea) return;
			const textarea = document.querySelector(
				`.clue-textarea[name="${activeTextarea}"]`
			);
			const li = textarea.closest(".clue-list-item");
			const liName = li.getAttribute("name");
			const liSelector = `.clue-list-item[name="${liName}"]`;

			if (e.target.matches(`${liSelector}, ${liSelector} *`)) return;

			setActiveTextarea(null);
			textarea.classList.remove("accessible");
		};
		document.addEventListener("click", handleBlurOnClick);
		startFetching();
		return () => {
			ignore = true;
			document.removeEventListener("click", handleBlurOnClick);
		};
	}, [direction, cells, matchFilterInput, isAutofilling, activeTextarea]);

	/* const handleClick = (e) => {
		if (cellSettings.cellBlockIsChecked) {
			setCellBlock(e, setCells);
			cellSettings.symmetryIsChecked &&
				setSymmetricalCellBlock(e, cells, setCells);
			setCellNumbers(setCells);
			setClues(setCells);
			setClueText(e, setCells);
		} else {
			setDirectionOnClick(e, cells, setDirection);
			setSelectedCell(e, setCells);
		}
	}; */
	/* 	const handleClick = (e) => {
		if (cellSettings.cellBlockIsChecked) {
			setCellBlock(e, setCells);
			cellSettings.symmetryIsChecked &&
				setSymmetricalCellBlock(e, cells, setCells);
			setCellNumbers(setCells);
			setClues(setCells);
			setClueText(e, setCells);
		} else if (cellSettings.shadedCellIsChecked) {
			setShadedCell(e, setCells);
		} else if (cellSettings.circleIsChecked) {
			setCircledCell(e, setCells);
		} else {
			setDirectionOnClick(e, cells, setDirection);
			setSelectedCell(e, setCells);
		}
	}; */
	const handleClick = (e) => {
		const {
			cellBlockIsChecked,
			symmetryIsChecked,
			shadedCellIsChecked,
			circleIsChecked,
		} = cellSettings;
		if (cellBlockIsChecked) {
			setCellBlock(e, setCells);
			symmetryIsChecked &&
				setSymmetricalCellStyle(e, cells, setCells, setCellBlock);
			setCellNumbers(setCells);
			setClues(setCells);
			setClueText(e, setCells);

			return;
		}

		if (!shadedCellIsChecked && !circleIsChecked) {
			setDirectionOnClick(e, cells, setDirection);
			setSelectedCell(e, setCells);

			return;
		}

		if (shadedCellIsChecked) {
			setShadedCell(e, setCells);
			symmetryIsChecked &&
				setSymmetricalCellStyle(e, cells, setCells, setShadedCell);
		}
		if (circleIsChecked) {
			setCircledCell(e, setCells);
			symmetryIsChecked &&
				setSymmetricalCellStyle(e, cells, setCells, setCircledCell);
		}
	};

	const handleLiClick = (e) => {
		const { cellBlockIsChecked, shadedCellIsChecked, circleIsChecked } =
			cellSettings;
		if (cellBlockIsChecked || shadedCellIsChecked || circleIsChecked) return;

		selectCellElementOnLiClick(e, direction, setDirection, cells);
	};

	/* 	const showMoreWordMatches = async () => {
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
	}; */
	const showMoreWordMatches = async () => {
		const { selectedWordObj } = getWordObj(direction, cells);
		const wordList = await fetchWordList(selectedWordObj?.word);
		const newWordMatches = await getWordMatches(
			selectedWordObj?.word,
			wordList
		);
		const filteredMatches = getFilteredMatches(
			matchFilterInput,
			newWordMatches
		);
		// console.log(filteredMatches);
		const tableLength = getMatchesFromTable().length;
		const next100Matches = getNext100Matches(filteredMatches, tableLength);
		const currentMatches = [...wordMatches.current, ...next100Matches];
		const hasMatchesLeft = areMatchesLeft(
			filteredMatches,
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
			// Does this need "await"?
			showMoreWordMatches();
		}
	};

	const handleKeyDown = (e) => {
		handleArrowKeys(e, direction, setDirection, cells);
		handleTabKey(e, direction, setDirection, cells);
		handleLetterKey(e, direction, setDirection, cells, setCells);
		handleBackspaceKey(e, direction, setDirection, cells, setCells);
	};

	/* const handleToggleChange = (e) => {
		removeCellSelection(setCells);

		const name = e.target.name;
		let settings = { ...cellSettings };
		settings[name] = !cellSettings[name];
		setCellSettings(settings);
	}; */
	const handleToggleChange = (e) => {
		removeCellSelection(setCells);

		const CELL_BLOCK_NAME = "cellBlockIsChecked";
		const SHADED_NAME = "shadedCellIsChecked";
		const CIRCLED_NAME = "circleIsChecked";
		const name = e.target.name;
		let settings = { ...cellSettings };
		if (name === CELL_BLOCK_NAME) {
			settings[SHADED_NAME] = false;
			settings[CIRCLED_NAME] = false;
		} else if (name === SHADED_NAME || name === CIRCLED_NAME) {
			settings[CELL_BLOCK_NAME] = false;
		}
		settings[name] = !cellSettings[name];
		setCellSettings(settings);
	};

	const handleChange = (e) => {
		handleToggleChange(e);
	};

	const handleDashChange = (e) => {
		setVisibleDashPage(e.target.value);
	};

	const handleMatchFilterChange = (e) => {
		setMatchFilterInput(e.target.value);
	};

	const handleClueText = (e) => {
		setClueText(e, setCells);
	};

	const handleGridOptionClick = (e) => {
		const buttonIndex = e.target.name.match(/\d+$/);
		setCells(() => gridOptions[buttonIndex]);
		setCellSettings({ ...cellSettings, newPuzzleIsChecked: false });
	};

	const handleNewPuzzleBlur = (e) => {
		if (
			!e.target.matches(".grid-options-background") &&
			!e.target.matches(".grid-options-header > .exit-button")
		)
			return;
		setCellSettings({ ...cellSettings, newPuzzleIsChecked: false });
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
				cellBlockIsChecked={cellSettings.cellBlockIsChecked}
				symmetryIsChecked={cellSettings.symmetryIsChecked}
				shadedCellIsChecked={cellSettings.shadedCellIsChecked}
				circleIsChecked={cellSettings.circleIsChecked}
				onChange={handleChange}
				gridOptions={gridOptions}
				newPuzzleIsChecked={cellSettings.newPuzzleIsChecked}
				onGridOptionClick={(e) => {
					handleGridOptionClick(e);
				}}
				onNewPuzzleBlur={(e) => handleNewPuzzleBlur(e)}
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
				onMatchFilterChange={handleMatchFilterChange}
				matchFilterInput={matchFilterInput}
				onClueLiTextareaChange={(e) => {
					handleClueLiTextareaChange(e);
					handleClueText(e);
				}}
				onClueEditButtonClick={(e) => {
					handleClueEditButtonClick(e, setActiveTextarea);
				}}
				onClueDoneButtonClick={(e) => {
					handleClueDoneButtonClick(e, setActiveTextarea);
				}}
				onClueTextareaFocus={(e) =>
					handleClueTextareaFocus(e, setActiveTextarea)
				}
				onClueTextareaBlur={(e) => {
					handleClueTextareaBlur(e, setActiveTextarea);
				}}
				activeTextarea={activeTextarea}
				onAutofillGridButtonClick={() =>
					handleFillGrid(cells, setCells, setIsAutofilling)
				}
				onClearFillButtonClick={() => handleClearFill(setCells)}
			/>
		</div>
	);
}
