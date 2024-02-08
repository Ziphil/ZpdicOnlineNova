//

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {EnhancedDictionary} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";
import {ChangeDictionarySourceForm} from "./change-dictionary-source-form";


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
          <h3 styleName="heading">{trans("heading.akrantiainSource")}</h3>
          <MultiLineText styleName="description">
            {trans("description.akrantiainSource")}
          </MultiLineText>
          <ChangeDictionarySourceForm dictionary={dictionary} language="akrantiain"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.zatlinSource")}</h3>
          <MultiLineText styleName="description">
            {trans("description.zatlinSource")}
          </MultiLineText>
          <ChangeDictionarySourceForm dictionary={dictionary} language="zatlin"/>
        </section>
      </div>
    );

  }
);