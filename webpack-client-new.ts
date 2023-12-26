//

import dotenv from "dotenv";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import {EnvironmentPlugin} from "webpack";


dotenv.config({path: "./variable.env"});

const config = {
  entry: ["babel-polyfill", "./client-new/index.tsx"],
  output: {
    path: path.join(__dirname, "dist", "client-new"),
    publicPath: "/client-new/",
    filename: "./bundle.js",
    chunkFilename: "./chunk-[name].js"
  },
  devtool: "source-map",
  stats: "errors-only",
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
            loader: "./loader/convert-unit-new.ts"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack"
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
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "raw-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", ".css", ".yml", ".md"],
    alias: {
      "/client-new": path.resolve(__dirname, "client-new"),
      "/server": path.resolve(__dirname, "server"),
      "/worker": path.resolve(__dirname, "worker")
    },
    fallback: {
      stream: require.resolve("stream-browserify")
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist", "client-new")
    },
    proxy: {
      "/internal": "http://localhost:8050",
      "/external": "http://localhost:8050",
      "/static": "http://localhost:8050"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client-new/public/index.html",
      title: "ZpDIC Online"
    }),
    new EnvironmentPlugin({
      "npm_package_version": "",
      "RECAPTCHA_KEY": "",
      "AWS_STORAGE_BUCKET": "",
      "ANALYTICS_ID": ""
    })
  ]
};

export default config;