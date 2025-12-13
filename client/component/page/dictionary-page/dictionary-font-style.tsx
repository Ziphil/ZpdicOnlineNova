/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {Helmet} from "react-helmet";
import {create} from "/client/component/create";
import {getAwsFileUrl} from "/client/util/aws";
import {Dictionary} from "/server/internal/skeleton";


export const DictionaryFontStyle = create(
  null, "DictionaryFontStyle",
  function ({
    dictionary
  }: {
    dictionary: Dictionary
  }): ReactElement {

    const css = getFontCss(dictionary);

    return (
      <Helmet>
        {(!!css) && <style>{css}</style>}
      </Helmet>
    );

  }
);


function getFontCss(dictionary: Dictionary): string | undefined {
  const font = dictionary.settings.font;
  const fontTargets = dictionary.settings.fontTargets;
  if (font.kind === "custom") {
    const url = getAwsFileUrl(`font/${dictionary.number}/font`);
    const css = `
      @font-face {
        font-family: "zpdic-custom-${dictionary.number}";
        font-weight: bold;
        src: url("${url}") format("${font.format}");
      }
      .dictionary-custom-font {
        ${fontTargets.map((fontTarget) => `
          &[data-target="${fontTarget}"] {
            font-family: "zpdic-custom-${dictionary.number}" !important;
            font-feature-settings: initial !important;
          }
        `).join("\n\n")}
      }
    `;
    return css;
  } else if (font.kind === "local") {
    const css = `
      .dictionary-custom-font {
        ${fontTargets.map((fontTarget) => `
          &[data-target="${fontTarget}"] {
            font-family: "${font.name}" !important;
            font-feature-settings: initial !important;
          }
        `).join("\n\n")}
      }
    `;
    return css;
  } else {
    return undefined;
  }
}