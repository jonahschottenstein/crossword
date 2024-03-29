import { getWordObj, getWhiteSquares } from "./words.js";
import { setCellLetter } from "./setCellLetter.js";
import {
	cellHasLetter,
	entryIsValid,
	changeDirection,
	getNextDirection,
	getSelectedCell,
	getBlankBefore,
	getBlankAfter,
	getCellAfter,
	selectCellElement,
} from "./helpers.js";

const getFirstBlank = (direction, cells) => {
	const { firstOpenWordObj } = getWordObj(direction, cells);
	const firstBlank = firstOpenWordObj?.firstBlank;

	return firstBlank;
};

const getFirstCell = (direction, cells) => {
	const { firstWordObj } = getWordObj(direction, cells);
	const { firstCell } = firstWordObj;

	return firstCell;
};

// TODO: Rename function name to getNextCellFirstOpt(ion)
const getNextCellFirstOptionOnLetterKey = (direction, cells) => {
	const selectedCell = getSelectedCell(cells);
	const selectedCellHasLetter = cellHasLetter(selectedCell);
	const { selectedWordObj } = getWordObj(direction, cells);
	const cellAfterInWord = getCellAfter(selectedWordObj.word);
	const blankAfterInWord = getBlankAfter(selectedWordObj.word);
	const firstOption = selectedCellHasLetter
		? cellAfterInWord
		: blankAfterInWord;

	return firstOption;
};

const getNextCellOnLetterKey = (direction, cells) => {
	const nextDirection = getNextDirection(direction);
	const { selectedWordObj, openWordObjAfter } = getWordObj(direction, cells);
	const firstOption = getNextCellFirstOptionOnLetterKey(direction, cells);
	const blankBeforeInWord = getBlankBefore(selectedWordObj.word);
	const firstBlankBeforeInWord =
		blankBeforeInWord && selectedWordObj.firstBlank;
	const firstBlankInOpenWordAfter = openWordObjAfter?.firstBlank;
	const firstBlankNextDirection = getFirstBlank(nextDirection, cells);
	const whiteSquares = getWhiteSquares(direction, cells);
	const cellAfter = getCellAfter(whiteSquares);
	const firstCellNextDirection = getFirstCell(nextDirection, cells);

	return (
		firstOption ||
		firstBlankBeforeInWord ||
		firstBlankInOpenWordAfter ||
		firstBlankNextDirection ||
		cellAfter ||
		firstCellNextDirection
	);
};

const selectCellElementOnLetterKey = (direction, cells) => {
	const nextCell = getNextCellOnLetterKey(direction, cells);

	selectCellElement(nextCell);
};

const changeDirectionOnLetterKey = (direction, setDirection, cells) => {
	const selectedCell = getSelectedCell(cells);
	const { selectedWordObj, openWordObjAfter } = getWordObj(direction, cells);
	const { word: selectedWord } = selectedWordObj;
	const blankBeforeInWord = getBlankBefore(selectedWord);
	const blankAfterInWord = getBlankAfter(selectedWord);
	const nextDirection = getNextDirection(direction);
	const firstBlankNextDirection = getFirstBlank(nextDirection, cells);
	const { lastWordObj } = getWordObj(direction, cells);
	const { lastCell: lastCellOfLastWord } = lastWordObj;

	if (blankBeforeInWord || blankAfterInWord || openWordObjAfter) return;
	if (firstBlankNextDirection) {
		if (cellHasLetter(selectedCell) && !selectedWordObj.lastCell?.isSelected)
			return;
	} else {
		if (!lastCellOfLastWord.isSelected) return;
	}

	changeDirection(setDirection);
};

export const handleLetterKey = (
	e,
	direction,
	setDirection,
	cells,
	setCells
) => {
	const isALetter = /^[A-Z]$/;

	if (e.type === "keydown" && !entryIsValid(e)) return;
	if (e.type === "click" && !isALetter.test(e.target.value)) return;

	const nextDirection = getNextDirection(direction);
	const firstBlankNextDirection = getFirstBlank(nextDirection, cells);
	const { selectedWordObj, openWordObjAfter } = getWordObj(direction, cells);
	const { word: selectedWord } = selectedWordObj;
	const blankAfterInWord = getBlankAfter(selectedWord);

	setCellLetter(e, cells, setCells);
	changeDirectionOnLetterKey(direction, setDirection, cells);

	if (
		firstBlankNextDirection?.isSelected &&
		!blankAfterInWord &&
		!openWordObjAfter
	)
		return;

	selectCellElementOnLetterKey(direction, cells);
};
