//

import type {
  StorybookConfig
} from "@storybook/core-common";
import dotenv from "dotenv";
import pathUtil from "path";
import {
  EnvironmentPlugin
} from "webpack";


dotenv.config({path: "./variable.env"});

const config = {
  stories: [
    "../client/story/**/*.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-interactions"
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5"
  },
  webpackFinal: async (config) => ({
    ...config,
    module: {
      ...config.module,
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
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "/client": pathUtil.join(process.cwd(), "client"),
      },
    },
    plugins: [
      ...(config.plugins ?? []),
      new EnvironmentPlugin(["npm_package_version", "RECAPTCHA_KEY", "AWS_STORAGE_BUCKET", "ANALYTICS_ID"])
    ]
  })
} as StorybookConfig;

module.exports = config;