/* eslint-disable react/jsx-closing-bracket-location */

import {ReactNode, useEffect} from "react";
import {create} from "/client/component/create";
import {getAwsFileUrl} from "/client/util/aws";
import {Dictionary} from "/server/internal/skeleton";


export const DictionaryFontStyle = create(
  null, "DictionaryFontStyle",
  function ({
    dictionary
  }: {
    dictionary: Dictionary
  }): ReactNode {

    const css = getFontCss(dictionary);

    useEffect(() => {
      const id = "dictionary-font-style";
      const existingStyleElement = document.getElementById(id);
      if (css) {
        if (existingStyleElement) {
          existingStyleElement.textContent = css;
        } else {
          const style = document.createElement("style");
          style.id = id;
          style.textContent = css;
          document.head.appendChild(style);
        }
      } else {
        if (existingStyleElement) {
          existingStyleElement.remove();
        }
      }
      return () => {
        const existingStyleElement = document.getElementById(id);
        if (existingStyleElement) {
          existingStyleElement.remove();
        }
      };
    }, [css]);

    return null;

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