/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {Helmet} from "react-helmet";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {getAwsFileUrl} from "/client/util/aws";


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
  if (font?.type === "custom") {
    const url = getAwsFileUrl(`font/${dictionary.number}/font`);
    const css = `
      @font-face {
        font-family: "zpdic-custom-${dictionary.number}";
        font-weight: bold;
        src: url("${url}") format("${font.format}");
      }
    `;
    return css;
  } else {
    return undefined;
  }
}