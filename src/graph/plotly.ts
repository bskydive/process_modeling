import * as Graph from "plotly.js";
import ISSUES_RAW from "./model/issues-closed.json";
import { ILineGraphIssuesRaw } from "./model/issues-closed.model";

function parseUIData(
	dataParsed: ILineGraphIssuesRaw
): Partial<Graph.PlotData>[] {
	let result: Partial<Graph.PlotData>[];

	result = [dataParsed];

	// result = [
	// 	{
	// 		x: dataParsed.parsedIssues.map((issue) => issue.closed),
	// 		y: dataParsed.parsedIssues.map(
	// 			(issue) => issue.durationHoursRawFloat
	// 		),
	// 	},
	// ];

	return result;
}

/**
 *  TODO use https://www.npmjs.com/package/angular-plotly.js
 * TODO add name(user) https://plotly.com/python/line-charts/#line-plot-modes
 */
function main() {
	const commitsGraphRootId = "id-graph-commits-user";
	// const dataParsed: IParsedData = parser(); // TODO solve file read issue for brpwser build
	const dataParsed: ILineGraphIssuesRaw = {
		...ISSUES_RAW[0],
		xaxis: "date",
		yaxis: "hours",
		name: 'username'
	};

	let dataGraph: Partial<Graph.PlotData>[] = parseUIData(dataParsed);
	let layout: Partial<Graph.Layout> = { width: 600, height: 400 };
	let config: Partial<Graph.Config> = {
		displaylogo: false,
		plotGlPixelRatio: 2,
	};
	console.log("UI render started");

	let commitGraph$: Promise<Graph.PlotlyHTMLElement> = Graph.newPlot(
		commitsGraphRootId,
		dataGraph,
		layout,
		config
	);

	commitGraph$.then((graph) =>
		console.log("UI render completed ", graph.childNodes.length)
	);

	// Graph.toImage(commitsGraphRootId).then((file)=>console.log('file:', file.length));
}

main();
