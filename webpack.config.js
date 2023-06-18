const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {};

/** 
 * TODO remove or replace simple tsc in `npm run parse`
 * for CLI file parsing
 * import+typescript+debug+node 
 */
const nodeConfig = {
	target: "node", // https://webpack.js.org/concepts/targets/
	entry: "./src/parser/parser.ts",
	mode: "development",
	output: {
		filename: "parser.js",
		path: path.resolve(__dirname, "dist/node"),
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
		fallback: {
			// "path": require.resolve("path-browserify")
			// "fs": require.resolve("fs-browserify")	// https://github.com/opengsn/gsn/issues/778
			// "tty": require.resolve("tty-browserify")	// https://stackoverflow.com/questions/68618902/webpack-cannot-read-property-readfile-of-undefined-no-output-files
		},
	},
	plugins: [
		new NodePolyfillPlugin({
			// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
			excludeAliases: ["console"],
		}),
	]
};

/** 
 * required for browser
 * <script type='module' won't work because of `nosniff` header MIME restrictions>
 * import+typescript+debug+v8
 */
const browserConfig = {
	target: "web", // https://webpack.js.org/concepts/targets/
	entry: "./src/graph/plotly.ts",
	mode: "development",
	output: {
		filename: "plotly.js",
		path: path.resolve(__dirname, "dist/browser"),
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
		fallback: {
			child_process: false,	// https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix
			fs: false,				// https://github.com/opengsn/gsn/issues/778
			tty: false,				// https://stackoverflow.com/questions/68618902/webpack-cannot-read-property-readfile-of-undefined-no-output-files
		},
	},
	plugins: [
		new NodePolyfillPlugin({
			// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
			excludeAliases: ["console"],
		}),
	],
};

module.exports = [
	// nodeConfig, // already compiled by `npm run parse`
	browserConfig
];
