//

import glob from "glob";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import externals from "webpack-node-externals";


const config = {
  entry: {
    index: ["./server/index.ts"],
    worker: ["./worker/index.ts"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  devtool: "source-map",
  target: "node",
  externals: [externals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader"
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
    extensions: [".tsx", ".ts", ".jsx", ".js", ".yml"],
    alias: {
      "/client": path.resolve(__dirname, "client"),
      "/server": path.resolve(__dirname, "server"),
      "/worker": path.resolve(__dirname, "worker"),
    }
  },
  optimization: {
    minimize: false
  },
  cache: true
};

const staticConfig = {
  entry: [
    ...glob.sync("./client/public/static/*"),
    ...glob.sync("./client/document/**/*.md")
  ],
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(html|svg|png|ico|txt)$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "static",
            name: "[name].[ext]"
          }
        }
      },
      {
        test: /\.md$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "document",
            context: "./client/document",
            name: "[path][name].[ext]"
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".scss", ".html", ".md"],
    alias: {
      "/client": path.resolve(__dirname, "client"),
      "/server": path.resolve(__dirname, "server"),
      "/worker": path.resolve(__dirname, "worker")
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/style.css",
      ignoreOrder: true
    })
  ]
};

export default [config, staticConfig];