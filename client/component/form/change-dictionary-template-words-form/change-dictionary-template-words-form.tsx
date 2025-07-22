/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";


export const ChangeDictionaryTemplateWordsForm = create(
  require("../common.scss"), "ChangeDictionaryTemplateWordsForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryTemplateWordsForm");

    return (
      <div styleName="root" {...rest}>
      </div>
    );

  }
);