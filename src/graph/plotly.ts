import * as Graph from "plotly.js";
import ISSUES_RAW from "./model/issues-closed.json";
import { ILineGraphIssuesRaw } from "./model/issues-closed.model";

function parseUIData(dataParsed: ILineGraphIssuesRaw): ILineGraphIssuesRaw[] {
	let result: ILineGraphIssuesRaw[];

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
		x: ISSUES_RAW[0].x,
		y: ISSUES_RAW[0].y,
		mode: "lines+markers",
		line: {
			shape: "spline",
			dash: "solid",
			width: 4,
		},
		type: "scatter",
		name: "username1",
		connectgaps: true,
	};

	let dataGraph: ILineGraphIssuesRaw[] = parseUIData(dataParsed);
	let layout: Partial<Graph.Layout> = {
		// width: 900,
		height: 800,
		xaxis: { title: "date" },
		yaxis: { title: "hours" },
		title: { text: "Hours by issue" },
		showlegend: true,
		legend: {
			y: 0.5,
			traceorder: "reversed",
			font: {
				size: 16,
			},
		},
	};
	let config: Partial<Graph.Config> = {
		// displaylogo: false,
		plotGlPixelRatio: 2,
	};
	console.log("UI render started");

	let commitGraph$: Promise<Graph.PlotlyHTMLElement> = Graph.newPlot(
		commitsGraphRootId,
		dataGraph as unknown as Partial<Graph.PlotData>[],
		layout,
		config
	);

	commitGraph$.then((graph) =>
		console.log(
			"UI render completed ",
			graph.childNodes.item(0).childNodes.length
		)
	);

	// Graph.toImage(commitsGraphRootId).then((file)=>console.log('file:', file.length));
}

main();
