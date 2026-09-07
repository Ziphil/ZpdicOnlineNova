//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {LimitView} from "/client/component/compound/limit-view";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
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

    const {trans} = useTrans("dictionaryLimitsView");

    const [sizes] = useSuspenseResponse("fetchDictionarySizes", {number: dictionary.number});

    return (
      <div styleName="root" {...rest}>
        <div styleName="list">
          <LimitView label={trans("label.wordCount")} current={sizes.word} max={dictionary.limits.dictionary.wordCount}/>
          <LimitView label={trans("label.exampleCount")} current={sizes.example} max={dictionary.limits.dictionary.exampleCount}/>
          <LimitView label={trans("label.articleCount")} current={sizes.article} max={dictionary.limits.dictionary.articleCount}/>
        </div>
      </div>
    );

  }
);
