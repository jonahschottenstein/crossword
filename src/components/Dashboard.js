import { DashboardHeader } from "./DashboardHeader";
import { DashboardPageContainer } from "./DashboardPageContainer";

export const Dashboard = (props) => {
	return (
		<div className="dashboard">
			<DashboardHeader
				visibleDashPage={props.visibleDashPage}
				onChange={props.onChange}
			/>
			<DashboardPageContainer
				direction={props.direction}
				cells={props.cells}
				visibleDashPage={props.visibleDashPage}
				onClick={props.onClick}
				wordMatches={props.wordMatches}
				onMatchClick={props.onMatchClick}
				matchFilterInput={props.matchFilterInput}
				onMatchFilterChange={props.onMatchFilterChange}
				onClueLiTextareaChange={props.onClueLiTextareaChange}
				onClueEditButtonClick={props.onClueEditButtonClick}
				onClueDoneButtonClick={props.onClueDoneButtonClick}
				onClueTextareaFocus={props.onClueTextareaFocus}
				onClueTextareaBlur={props.onClueTextareaBlur}
				activeTextarea={props.activeTextarea}
				onAutofillGridButtonClick={props.onAutofillGridButtonClick}
				onClearFillButtonClick={props.onClearFillButtonClick}
			/>
		</div>
	);
};
