import * as Plot from "plotly.js";
import ISSUES_STUB_RAW from "./model/issues-closed.stub.json";
import ISSUES_RAW from "./data/issues-closed.vscode.json";
import {
	TPlotLine,
	IUserValues,
	USER_VALUES_EMPTY,
	TPlotLineData,
	LINE_PLOT_SETTINGS,
	LAYOUT_PLOT_SETTINGS,
} from "./model/plot-line.model";
import { IGithubIssueParsed } from "../parser/model/vscode.issues-closed.response";

function parsePullsPlotLines(data: IGithubIssueParsed[]): TPlotLineData[] {
	// TODO for pulls use also issue.assignees[0]
	return [];
}

/** TODO fill empty date values */
function parseIssuesPlotLines(data: IGithubIssueParsed[]): TPlotLine[] {
	let plotLines: TPlotLine[] = [];
	/** add issues without assignee or user */
	let plotUserDataGroups: Map<string, IUserValues> = new Map<
		string,
		IUserValues
	>([["none", USER_VALUES_EMPTY]]);
	/** add start 0 value for all lines */
	const startDate: string = data[data.length-1].closed;

	// group values by users
	data.forEach((issue) => {
		const userName: string = issue.user ?? issue.assignee ?? "none";
		/** accumulator for existed user in Map() */
		let valuePrev: IUserValues | undefined =
			plotUserDataGroups.get(userName);
		/** 
		 * initial value for new user in Map() 
		 */
		let valueNext: IUserValues = {
			dates: [issue.closed],
			hours: [issue.durationHoursRawFloat],
		};

		if (valuePrev) {
			valueNext.dates = valuePrev.dates.concat(issue.closed);
			valueNext.hours = valuePrev.hours.concat(issue.durationHoursRawFloat);
		}

		plotUserDataGroups.set(userName, valueNext);
	});

	// convert groups to plot lines, map data to axes
	plotUserDataGroups.forEach((line, user) => {
		plotLines.push({
			...LINE_PLOT_SETTINGS,
			x: line.dates,
			y: line.hours,
			name: user,
		});
	});

	return plotLines;
}

/**
 * TODO add name(user) https://plotly.com/python/line-charts/#line-plot-modes
 */
function main() {
	/** TODO use in unit test */
	const testStub: IGithubIssueParsed[] = ISSUES_STUB_RAW;
	const commitsGraphRootId = "id-graph-commits-user";
	// TODO load from file.read, not JSON import
	// const dataParsed: IGithubIssueParsed[] = parser();
	/**
	 * need `as unknown` because of IDE tsc JSON parse error
	 */
	const dataParsed: IGithubIssueParsed[] = ISSUES_RAW as unknown as IGithubIssueParsed[]
	const dataLines: TPlotLine[] = parseIssuesPlotLines(dataParsed);

	let layout: Partial<Plot.Layout> = {
		...LAYOUT_PLOT_SETTINGS,
		xaxis: { title: "date" },
		yaxis: { title: "hours" },
		title: { text: "Hours by issue" },
	};
	let config: Partial<Plot.Config> = {
		// displaylogo: false,
		plotGlPixelRatio: 2,
	};
	console.log("UI render started");

	let commitGraph$: Promise<Plot.PlotlyHTMLElement> = Plot.newPlot(
		commitsGraphRootId,
		dataLines,
		layout,
		config
	);

	commitGraph$.then((graph) =>
		console.log(
			"UI render completed ",
			graph.innerHTML.length
		)
	);

	// Graph.toImage(commitsGraphRootId).then((file)=>console.log('file:', file.length));
}

main();
