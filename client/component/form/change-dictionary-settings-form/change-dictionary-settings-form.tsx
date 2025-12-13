//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableCard,
  CheckableCardBody,
  ControlContainer,
  GeneralIcon,
  Input,
  MultiLineText,
  Radio,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary, DictionarySettings} from "/server/internal/skeleton";
import {useChangeDictionarySettings} from "./change-dictionary-settings-form-hook";
import {IgnoredPatternInput} from "./ignored-pattern-input";


export const ChangeDictionarySettingsForm = create(
  require("../common.scss"), "ChangeDictionarySettingsForm",
  function <N extends keyof DictionarySettings>({
    dictionary,
    propertyName,
    ...rest
  }: {
    dictionary: Dictionary,
    propertyName: N,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionarySettingsForm");

    const {form, handleSubmit} = useChangeDictionarySettings(dictionary, propertyName);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        {(propertyName === "enableAdvancedWord") ? (
          <ControlContainer label={false}>
            <div styleName="card-group">
              <CheckableCard styleName="card">
                <Radio value="true" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.enableAdvancedWord.true")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enableAdvancedWord.true")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
              <CheckableCard styleName="card">
                <Radio value="false" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.enableAdvancedWord.false")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enableAdvancedWord.false")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            </div>
          </ControlContainer>
        ) : (propertyName === "enableProposal") ? (
          <ControlContainer label={false}>
            <div styleName="card-group">
              <CheckableCard styleName="card">
                <Radio value="true" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.enableProposal.true")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enableProposal.true")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
              <CheckableCard styleName="card">
                <Radio value="false" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.enableProposal.false")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enableProposal.false")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            </div>
          </ControlContainer>
        ) : (propertyName === "enableDuplicateName") ? (
          <ControlContainer label={false}>
            <div styleName="card-group">
              <CheckableCard styleName="card">
                <Radio value="true" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.enableDuplicateName.true")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enableDuplicateName.true")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
              <CheckableCard styleName="card">
                <Radio value="false" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.enableDuplicateName.false")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.enableDuplicateName.false")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            </div>
          </ControlContainer>
        ) : (propertyName === "punctuations") ? (
          <ControlContainer>
            <Input {...register("value")}/>
          </ControlContainer>
        ) : (propertyName === "ignoredEquivalentPattern") ? (
          <ControlContainer>
            <IgnoredPatternInput
              error={getFieldState("value").error !== undefined}
              {...register("value")}
            />
            <ControlErrorMessage name="value" form={form} trans={trans}/>
          </ControlContainer>
        ) : (propertyName === "exampleTitle") ? (
          <ControlContainer>
            <Input {...register("value")}/>
          </ControlContainer>
        ) : (propertyName === "pronunciationTitle") ? (
          <ControlContainer>
            <Input {...register("value")}/>
          </ControlContainer>
        ) : (propertyName === "showVariationPronunciation") ? (
          <ControlContainer label={false}>
            <div styleName="card-group">
              <CheckableCard styleName="card">
                <Radio value="true" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.showVariationPronunciation.true")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.showVariationPronunciation.true")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
              <CheckableCard styleName="card">
                <Radio value="false" {...register("value")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans("label.showVariationPronunciation.false")}</div>
                    <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.showVariationPronunciation.false")}</MultiLineText>
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            </div>
          </ControlContainer>
        ) : null}
        <div>
          <Button variant="light" type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);