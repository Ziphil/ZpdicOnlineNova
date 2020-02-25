//

import {
  CleanWebpackPlugin
} from "clean-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";


let config = {
  entry: ["babel-polyfill", "./client/index.tsx"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "./js/[name].bundle.js"
  },
  devtool: "source-map",
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
          loader: "awesome-typescript-loader"
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
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      "/api": "http://localhost:8050"
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["dist"]
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "ZpDIC Online"
    })
  ]
};

export default config;