//

import type {
  StorybookConfig
} from "@storybook/core-common";
import pathUtil from "path";


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
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent) ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules ?? []),
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
      ]
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "/client": pathUtil.join(process.cwd(), "client"),
      },
    },
  })
} as StorybookConfig;

module.exports = config;