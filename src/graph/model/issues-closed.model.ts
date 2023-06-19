import * as Graph from "plotly.js";

export interface ILineGraphIssuesRaw
	extends Pick<Graph.PlotData, "mode" | "line" | "type" | "connectgaps"> {
	x: string[];
	y: number[];
	name: string;
	connectgaps: boolean;
}
