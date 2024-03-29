import { memo } from "react";

export const SubmissionInfoItem = memo(function SubmissionInfoItem(props) {
	return (
		<div className="submission-info-item">
			<label htmlFor={props.labelFor} className="submission-info-label">
				{props.labelText + ":"}
			</label>
			{props.name === "state" ? (
				<select
					name={props.name}
					id={props.id}
					value={props.value}
					onChange={props.onChange}>
					<option value="">Choose a state</option>
					<option value="AL">AL</option>
					<option value="AK">AK</option>
					<option value="AR">AR</option>
					<option value="AZ">AZ</option>
					<option value="CA">CA</option>
					<option value="CO">CO</option>
					<option value="CT">CT</option>
					<option value="DC">DC</option>
					<option value="DE">DE</option>
					<option value="FL">FL</option>
					<option value="GA">GA</option>
					<option value="HI">HI</option>
					<option value="IA">IA</option>
					<option value="ID">ID</option>
					<option value="IL">IL</option>
					<option value="IN">IN</option>
					<option value="KS">KS</option>
					<option value="KY">KY</option>
					<option value="LA">LA</option>
					<option value="MA">MA</option>
					<option value="MD">MD</option>
					<option value="ME">ME</option>
					<option value="MI">MI</option>
					<option value="MN">MN</option>
					<option value="MO">MO</option>
					<option value="MS">MS</option>
					<option value="MT">MT</option>
					<option value="NC">NC</option>
					<option value="NE">NE</option>
					<option value="NH">NH</option>
					<option value="NJ">NJ</option>
					<option value="NM">NM</option>
					<option value="NV">NV</option>
					<option value="NY">NY</option>
					<option value="ND">ND</option>
					<option value="OH">OH</option>
					<option value="OK">OK</option>
					<option value="OR">OR</option>
					<option value="PA">PA</option>
					<option value="RI">RI</option>
					<option value="SC">SC</option>
					<option value="SD">SD</option>
					<option value="TN">TN</option>
					<option value="TX">TX</option>
					<option value="UT">UT</option>
					<option value="VT">VT</option>
					<option value="VA">VA</option>
					<option value="WA">WA</option>
					<option value="WI">WI</option>
					<option value="WV">WV</option>
					<option value="WY">WY</option>
				</select>
			) : (
				//* Email pattern regular expression source: https://www.w3schools.com/tags/att_input_pattern.asp
				<>
					<input
						type={props.type}
						name={props.name}
						id={props.id}
						pattern={
							props.name === "zipCode"
								? "\\d{5,5}"
								: props.name === "email"
								? "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+.[a-zA-Z]{2,}"
								: null
						}
						maxLength={props.name === "zipCode" ? "5" : null}
						value={props.value}
						onChange={props.onChange}></input>
					{props.name === "zipCode" && (
						<span className="zip-code-help submission-info-help">
							Format: #####
						</span>
					)}
					{props.name === "puzzleTitle" && (
						<span className="puzzle-title-help submission-info-help">
							Puzzle titles can be the theme revealers for daily themed puzzles
							or marquee entries for themeless puzzles
						</span>
					)}
				</>
			)}
		</div>
	);
});
