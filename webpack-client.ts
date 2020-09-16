//

import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import {
  BundleAnalyzerPlugin
} from "webpack-bundle-analyzer";


let config = {
  entry: ["babel-polyfill", "./client/index.tsx"],
  output: {
    path: path.join(__dirname, "dist", "client"),
    publicPath: "/client/",
    filename: "./bundle.js",
    chunkFilename: "./chunk-[name].js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig-esnext.json"
          }
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {modules: {localIdentName: "[name]_[local]_[hash:base64:5]"}, url: false}
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.yml$/,
        use: [
          {
            loader: "json-loader"
          },
          {
            loader: "yaml-flat-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", ".yml"],
    alias: {
      "/client": path.resolve(__dirname, "client"),
      "/server": path.resolve(__dirname, "server")
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    contentBase: path.join(__dirname, "dist", "client"),
    proxy: {
      "/api": "http://localhost:8050",
      "/static": "http://localhost:8050"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
      title: "ZpDIC Online"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: (!!process.env["ANALYZE"]) ? "static" : "disabled",
      reportFilename: path.join(__dirname, "dist", "client", "stats.html")
    })
  ]
};

export default config;