//

import * as path from "path";
import * as externals from "webpack-node-externals";


let config = {
  entry: ["./server/index.ts"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  },
  devtool: "source-map",
  target: "node",
  externals: [externals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "/client": path.resolve(__dirname, "client"),
      "/server": path.resolve(__dirname, "server")
    }
  },
  optimization: {
    minimize: false
  }
};

export default config;