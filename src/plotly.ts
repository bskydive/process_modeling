import * as Graph from "plotly.js";

// TODO https://www.npmjs.com/package/angular-plotly.js
function main() {
	const commitsGraphRootId = "id-graph-commits-user";

	let data: Partial<Graph.PlotData>[] = [];
	let layout: Partial<Graph.Layout> = { width: 600, height: 400 };
	let config: Partial<Graph.Config> = {
		displaylogo: false,
		plotGlPixelRatio: 2,
	};
	console.log("UI render started");

	let commitGraph$: Promise<Graph.PlotlyHTMLElement> = Graph.newPlot(commitsGraphRootId, data, layout, config);

	commitGraph$.then((graph)=>console.log('UI render completed ', graph.childNodes.length))

	// Graph.toImage(commitsGraphRootId).then((file)=>console.log('file:', file.length));
}

main();
console.log('works');

