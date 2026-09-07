//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";


export const DictionaryLimitsView = create(
  require("./dictionary-limits-view.scss"), "DictionaryLimitsView",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" {...rest}/>
    );

  }
);
