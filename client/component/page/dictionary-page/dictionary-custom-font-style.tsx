/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {Helmet} from "react-helmet";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {getAwsFileUrl} from "/client/util/aws";


export const DictionaryCustomFontStyle = create(
  null, "DictionaryCustomFontStyle",
  function ({
    dictionary
  }: {
    dictionary: Dictionary
  }): ReactElement {

    const css = getCustomFontCss(dictionary);

    return (
      <Helmet>
        {(!!css) && <style>{css}</style>}
      </Helmet>
    );

  }
);


function getCustomFontCss(dictionary: Dictionary): string | undefined {
  const fontSpec = dictionary.settings.fontSpec;
  if (fontSpec?.type === "custom") {
    const url = getAwsFileUrl(`font/${dictionary.number}/font`);
    const css = `
      @font-face {
        font-family: "zpdic-custom-${dictionary.number}";
        font-weight: bold;
        src: url("${url}") format("${fontSpec.format}");
      }
    `;
    return css;
  } else {
    return undefined;
  }
}