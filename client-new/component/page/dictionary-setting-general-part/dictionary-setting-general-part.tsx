/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, MultiLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {ChangeDictionaryExplanationForm} from "/client-new/component/form/change-dictionary-explanation-form";
import {ChangeDictionaryNameForm} from "/client-new/component/form/change-dictionary-name-form";
import {ChangeDictionaryParamNameForm} from "/client-new/component/form/change-dictionary-param-name-form";
import {ChangeDictionarySecretForm} from "/client-new/component/form/change-dictionary-secret-form";
import {EnhancedDictionary} from "/client-new/skeleton";


export const DictionarySettingGeneralPart = create(
  require("./dictionary-setting-general-part.scss"), "DictionarySettingGeneralPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingGeneralPart");

    const {dictionary} = useOutletContext<{dictionary: EnhancedDictionary}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.name")}</h3>
          <ChangeDictionaryNameForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.paramName")}</h3>
          <MultiLineText styleName="description">
            {trans("description.paramName")}
          </MultiLineText>
          <ChangeDictionaryParamNameForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.explanation")}</h3>
          <MultiLineText styleName="description">
            {trans("description.explanation")}
          </MultiLineText>
          <ChangeDictionaryExplanationForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.secret")}</h3>
          <ChangeDictionarySecretForm dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);