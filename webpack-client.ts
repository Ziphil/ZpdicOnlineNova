//

import dotenv from "dotenv";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import {EnvironmentPlugin} from "webpack";


dotenv.config({path: "./variable.env"});

const config = {
  entry: ["babel-polyfill", "./client/index.tsx"],
  output: {
    path: path.join(__dirname, "dist", "client"),
    publicPath: "/client/",
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
            loader: "./loader/convert-unit.ts"
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
      "/client": path.resolve(__dirname, "client"),
      "/server": path.resolve(__dirname, "server"),
      "/worker": path.resolve(__dirname, "worker"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-helmet": path.resolve(__dirname, "node_modules/react-helmet"),
      "react-intl": path.resolve(__dirname, "node_modules/react-intl"),
      "recoil": path.resolve(__dirname, "node_modules/recoil"),
    },
    fallback: {
      stream: require.resolve("stream-browserify")
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist", "client")
    },
    proxy: {
      "/internal": "http://localhost:8050",
      "/external": "http://localhost:8050",
      "/static": "http://localhost:8050",
      "/socket.io": {target: "http://localhost:8050", ws: true}
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
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