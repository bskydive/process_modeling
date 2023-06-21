import * as Plot from "plotly.js";

export type TPlotLineData = Pick<Plot.PlotData, "x" | "y" | "name">;

export type TPlotLineSettings = Partial<Pick<
	Plot.PlotData,
	"mode" | "line" | "type" | "connectgaps"
>>;

/** One line on the graph */
export type TPlotLine = TPlotLineData | TPlotLineSettings;

export interface IUserValues {
	dates: string[];
	hours: number[];
}

export const USER_VALUES_EMPTY = {
	dates: [],
	hours: [],
};

export const LINE_PLOT_SETTINGS: TPlotLineSettings = {
	mode: "markers",
	line: {
		// shape: "spline",
		dash: "solid",
		width: 2,
	},
	// type: "scatter",
	// connectgaps: true,
};

export const LAYOUT_PLOT_SETTINGS: Partial<Plot.Layout> = {
	// width: 900,
	height: 800,
	showlegend: true,
	legend: {
		y: 0.5,
		// traceorder: "reversed",
		font: {
			size: 16,
		},
	},
};
