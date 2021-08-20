const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/**@type {import('webpack').Configuration}*/
const config = {
  entry: path.resolve(__dirname, "index.ts"),
  output: {
    path: path.resolve(__dirname, "../../", "dist", "webview"),
    filename: "index.js",
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "src", "gui"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: "eslint-loader",
            options: {
              fix: false,
              emitWarning: false,
              emitError: false,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [new CopyPlugin([{ from: "*.html", flatten: true }])],
};
module.exports = config;
