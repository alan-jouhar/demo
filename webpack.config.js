const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./src/index.tsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "inline-source-map",
	devServer: {
		static: "./dist",
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "React App",
			template: "index.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					"ts-loader",
				],
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/g,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
					},
				},
			},
			{
				test: /\.css$/g,
				use: ["style-loader", "css-loader"],
			},
		],
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"],
	},
};
