/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, useTrans} from "zographia";
import {EnhancedDictionary} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";


export const DictionarySettingEditingPart = create(
  require("./dictionary-setting-editing-part.scss"), "DictionarySettingEditingPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingEditingPart");

    const {dictionary} = useOutletContext<{dictionary: EnhancedDictionary}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.akrantiain")}</h3>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.zatlin")}</h3>
        </section>
      </div>
    );

  }
);