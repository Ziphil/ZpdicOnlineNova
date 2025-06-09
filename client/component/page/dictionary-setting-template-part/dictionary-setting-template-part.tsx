//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";


export const DictionarySettingTemplatePart = create(
  require("./dictionary-setting-template-part.scss"), "DictionarySettingTemplatePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionarySettingTemplatePart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.templateWords")}</h3>
        </section>
      </div>
    );

  }
);