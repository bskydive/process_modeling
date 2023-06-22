import * as Plot from "plotly.js";
import ISSUES_STUB_RAW from "./model/issues-closed.stub.json";
import ISSUES_RAW from "./data/issues-closed.vscode.json";
import PULLS_STUB_RAW from "./model/pulls-closed.stub.json";
import PULLS_RAW from "./data/pulls-closed.vscode.json";
import COMMITS_STUB_RAW from "./model/commits.stub.json";
import COMMITS_RAW from "./data/commits.vscode.json";
import {
	TPlotLine,
	IDatesNumbersPlotLine,
	USER_VALUES_EMPTY,
	TPlotLineData,
	LINE_PLOT_SETTINGS,
	LAYOUT_PLOT_SETTINGS,
	IPlotLineTitles,
} from "./model/plot-line.model";
import { IGithubIssueParsed } from "../parser/model/vscode.issues-closed.response";
import { IGithubPullParsed } from "../parser/model/vscode.pulls-closed.response";
import { IGithubCommitParsed } from "../parser/model/vscode.commits.response";

function parseCommitsPlotLines(data: IGithubCommitParsed[]): TPlotLine[] {
	let plotLines: TPlotLine[] = [];
	/** add issues without assignee or user */
	let plotUserDataGroups: Map<string, IDatesNumbersPlotLine> = new Map<
		string,
		IDatesNumbersPlotLine
	>([["none", USER_VALUES_EMPTY]]);

	// group values by users
	data.forEach((commit) => {
		const userName: string = commit.author ?? "none";
		/** accumulator for existed user in Map() */
		let valuePrev: IDatesNumbersPlotLine | undefined =
			plotUserDataGroups.get(userName);
		/**
		 * initial value for new user in Map()
		 */
		let valueNext: IDatesNumbersPlotLine = {
			dates: [commit.date],
			values: [commit.hour],
		};

		if (valuePrev) {
			valueNext.dates = valuePrev.dates.concat(commit.date);
			valueNext.values = valuePrev.values.concat(commit.hour);
		}

		plotUserDataGroups.set(userName, valueNext);
	});

	// convert groups to plot lines, map data to axes
	plotUserDataGroups.forEach((line, user) => {
		plotLines.push({
			...LINE_PLOT_SETTINGS,
			x: line.dates,
			y: line.values,
			name: user,
		});
	});

	return plotLines;
}

/** TODO for pulls use also issue.assignees[0] */
function parsePullsPlotLines(data: IGithubPullParsed[]): TPlotLine[] {
	let plotLines: TPlotLine[] = [];
	/** add issues without assignee or user */
	let plotUserDataGroups: Map<string, IDatesNumbersPlotLine> = new Map<
		string,
		IDatesNumbersPlotLine
	>([["none", USER_VALUES_EMPTY]]);

	// group values by users
	data.forEach((issue) => {
		const userName: string = issue.user ?? issue.assignee ?? "none";
		/** accumulator for existed user in Map() */
		let valuePrev: IDatesNumbersPlotLine | undefined =
			plotUserDataGroups.get(userName);
		/**
		 * initial value for new user in Map()
		 */
		let valueNext: IDatesNumbersPlotLine = {
			dates: [issue.closed],
			values: [issue.durationHoursRawFloat],
		};

		if (valuePrev) {
			valueNext.dates = valuePrev.dates.concat(issue.closed);
			valueNext.values = valuePrev.values.concat(
				issue.durationHoursRawFloat
			);
		}

		plotUserDataGroups.set(userName, valueNext);
	});

	// convert groups to plot lines, map data to axes
	plotUserDataGroups.forEach((line, user) => {
		plotLines.push({
			...LINE_PLOT_SETTINGS,
			x: line.dates,
			y: line.values,
			name: user,
		});
	});

	return plotLines;
}

function parseIssuesPlotLines(data: IGithubIssueParsed[]): TPlotLine[] {
	let plotLines: TPlotLine[] = [];
	/** add issues without assignee or user */
	let plotUserDataGroups: Map<string, IDatesNumbersPlotLine> = new Map<
		string,
		IDatesNumbersPlotLine
	>([["none", USER_VALUES_EMPTY]]);

	// group values by users
	data.forEach((issue) => {
		const userName: string = issue.user ?? issue.assignee ?? "none";
		/** accumulator for existed user in Map() */
		let valuePrev: IDatesNumbersPlotLine | undefined =
			plotUserDataGroups.get(userName);
		/**
		 * initial value for new user in Map()
		 */
		let valueNext: IDatesNumbersPlotLine = {
			dates: [issue.closed],
			values: [issue.durationHoursRawFloat],
		};

		if (valuePrev) {
			valueNext.dates = valuePrev.dates.concat(issue.closed);
			valueNext.values = valuePrev.values.concat(
				issue.durationHoursRawFloat
			);
		}

		plotUserDataGroups.set(userName, valueNext);
	});

	// convert groups to plot lines, map data to axes
	plotUserDataGroups.forEach((line, user) => {
		plotLines.push({
			...LINE_PLOT_SETTINGS,
			x: line.dates,
			y: line.values,
			name: user,
		});
	});

	return plotLines;
}

function renderPlot(
	commitsGraphRootId: string,
	dataLines: TPlotLine[],
	titles: IPlotLineTitles
) {
	let layout: Partial<Plot.Layout> = {
		...LAYOUT_PLOT_SETTINGS,
		xaxis: { title: titles.xTitle },
		yaxis: { title: titles.yTitle },
		title: { text: titles.plotTitle },
		legend: { title: { text: titles.legendTitle } },
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
		console.log("UI render completed ", graph.innerHTML.length)
	);

	// Graph.toImage(commitsGraphRootId).then((file)=>console.log('file:', file.length));
}

/**
 * TODO add name(user) https://plotly.com/python/line-charts/#line-plot-modes
 */
function main() {
	// TODO load from file.read, not JSON import
	// const dataParsed: IGithubIssueParsed[] = parser();
	/** TODO use in unit test */
	const testStub: IGithubIssueParsed[] = ISSUES_STUB_RAW;

	const issuesGraphRootId = "id-graph-issues-user";
	const pullsGraphRootId = "id-graph-pulls-user";
	const commitsGraphRootId = "id-graph-commits-user";

	/** `as unknown` because of IDE tsc JSON parse error */
	const issuesParsed: IGithubIssueParsed[] =
		ISSUES_RAW as unknown as IGithubIssueParsed[];
	const issuesPlotLines: TPlotLine[] = parseIssuesPlotLines(issuesParsed);
	const pullsParsed: IGithubPullParsed[] =
		PULLS_RAW as unknown as IGithubPullParsed[];
	const pullsPlotLines: TPlotLine[] = parsePullsPlotLines(pullsParsed);
	const commitsParsed: IGithubCommitParsed[] =
		COMMITS_RAW as unknown as IGithubCommitParsed[];
	const commitsPlotLines: TPlotLine[] = parseCommitsPlotLines(commitsParsed);

	const issuesPlotTitles: IPlotLineTitles = {
		xTitle: "Date",
		yTitle: "Hours spent",
		plotTitle: "Hours by issue",
		legendTitle: "Users",
	};
	const pullsPlotTitles: IPlotLineTitles = {
		xTitle: "Date",
		yTitle: "Hours spent",
		plotTitle: "Hours by pull",
		legendTitle: "Users",
	};

	const commitsPlotTitles: IPlotLineTitles = {
		xTitle: "Date",
		yTitle: "Hour of a day",
		plotTitle: "Hour of commits",
		legendTitle: "Users",
	};

	renderPlot(issuesGraphRootId, issuesPlotLines, issuesPlotTitles);
	renderPlot(pullsGraphRootId, pullsPlotLines, pullsPlotTitles);
	renderPlot(commitsGraphRootId, commitsPlotLines, commitsPlotTitles);
}

main();
