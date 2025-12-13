/* eslint-disable react/jsx-closing-bracket-location */

import {faTriangleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useOutletContext} from "react-router-dom";
import {AdditionalProps, Callout, CalloutBody, CalloutIconContainer, GeneralIcon, MultiLineText, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ChangeDictionaryExplanationForm} from "/client/component/form/change-dictionary-explanation-form";
import {ChangeDictionaryNameForm} from "/client/component/form/change-dictionary-name-form";
import {ChangeDictionaryParamNameForm} from "/client/component/form/change-dictionary-param-name-form";
import {ChangeDictionarySettingsForm} from "/client/component/form/change-dictionary-settings-form";
import {ChangeDictionaryVisibilityForm} from "/client/component/form/change-dictionary-visibility-form";
import {DiscardDictionaryButton} from "/client/component/form/discard-dictionary-button";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


export const DictionarySettingGeneralPart = create(
  require("./dictionary-setting-general-part.scss"), "DictionarySettingGeneralPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingGeneralPart");

    const {dictionary} = useOutletContext<{dictionary: DictionaryWithExecutors}>();

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
          <h3 styleName="heading">{trans("heading.visibility")}</h3>
          <ChangeDictionaryVisibilityForm dictionary={dictionary}/>
        </section>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.enableProposal")}</h3>
          <ChangeDictionarySettingsForm dictionary={dictionary} propertyName="enableProposal"/>
        </section>
        <section styleName="section">
          <h3 styleName="heading" {...data({danger: true})}>{trans("heading.discard")}</h3>
          <Callout styleName="callout" scheme="red">
            <CalloutIconContainer><GeneralIcon icon={faTriangleExclamation}/></CalloutIconContainer>
            <CalloutBody>
              <MultiLineText is="p">
                {trans("callout.discard")}
              </MultiLineText>
            </CalloutBody>
          </Callout>
          <DiscardDictionaryButton dictionary={dictionary}/>
        </section>
      </div>
    );

  }
);