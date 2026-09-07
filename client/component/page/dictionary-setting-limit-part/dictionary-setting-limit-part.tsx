//

import {ReactElement} from "react";
import {useOutletContext} from "react-router";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryLimitsView} from "/client/component/form/dictionary-limits-view";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


export const DictionarySettingLimitPart = create(
  require("./dictionary-setting-limit-part.scss"), "DictionarySettingLimitPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingLimitPart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.usage")}</h3>
          <DictionaryLimitsView dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);
