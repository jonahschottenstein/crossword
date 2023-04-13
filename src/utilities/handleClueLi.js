const autoExpand = (textarea) => {
	textarea.style.height = "inherit";
	const textareaStyles = window.getComputedStyle(textarea);
	const height =
		parseInt(textareaStyles.getPropertyValue("border-top-width"), 10) +
		parseInt(textareaStyles.getPropertyValue("padding-top"), 10) +
		textarea.scrollHeight +
		parseInt(textareaStyles.getPropertyValue("padding-bottom"), 10) +
		parseInt(textareaStyles.getPropertyValue("border-bottom-width"), 10);

	textarea.style.height = height + "px";
};

const handleTextareaHeight = (e) => {
	if (e.target.tagName.toLowerCase() !== "textarea") return;
	autoExpand(e.target);
};

export const handleClueLiTextareaChange = (e) => {
	handleTextareaHeight(e);
};

export const handleClueEditButtonClick = (e) => {
	const closestLi = e.target.closest(".clue-list-item");
	const closestTextarea = closestLi.querySelector("textarea");
	if (!closestLi.classList.contains("highlighted")) {
		closestLi.click();
	}
	closestTextarea.classList.add("accessible");
	closestTextarea.focus();
};

export const handleClueDoneButtonClick = (e, setIsEditing) => {
	setIsEditing(null);

	const closestLi = e.target.closest(".clue-list-item");
	const closestTextarea = closestLi.querySelector("textarea");
	closestTextarea.classList.remove("accessible");
	const selectedCellElement = document.querySelector(".cell.selected");
	if (selectedCellElement) {
		selectedCellElement.focus();
	}
};
export const handleClueTextareaFocus = (e, setIsEditing) => {
	console.log("textareaFocus");
	setIsEditing(e.target.getAttribute("name"));
};

export const handleClueTextareaBlur = (e, setIsEditing) => {
	console.log("BLUR");
	// setIsEditing(null);
	const closestLi = e.target.closest(".clue-list-item");
	// const closestTextarea = closestLi.querySelector("textarea");
	// closestTextarea.classList.remove("accessible");
	const doneButton = closestLi.querySelector(".clue-done-button");
	console.log({ doneButton });
	doneButton.click();
};