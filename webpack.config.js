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
			template: "index.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/i,
				use: ["ts-loader"],
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/i,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
		],
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"],
	},
};
