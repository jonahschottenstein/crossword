import { memo } from "react";

export const DashboardStatsTable = memo(function DashboardStatsTable({
	gridSize,
	totalWordCount,
	blackSquareCount,
	avgWordLength,
	scrabbleScore,
	pangram,
}) {
	return (
		<table className="dashboard-stats-table">
			<tbody>
				<tr>
					<td className="td-label">Size:</td>
					<td className="td-value">{gridSize}</td>
				</tr>
				<tr>
					<td className="td-label">Total Words:</td>
					<td className="td-value">{totalWordCount}</td>
				</tr>
				<tr>
					<td className="td-label">Black Squares:</td>
					<td className="td-value">{blackSquareCount}</td>
				</tr>
				<tr>
					<td className="td-label">Avg. Word Length:</td>
					<td className="td-value">{avgWordLength}</td>
				</tr>
				<tr>
					<td className="td-label">Scrabble score:</td>
					<td className="td-value">{scrabbleScore}</td>
				</tr>
				<tr>
					<td className="td-label">Pangram:</td>
					<td className="td-value">{pangram}</td>
				</tr>
			</tbody>
		</table>
	);
});
