//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableContainer,
  CheckableLabel,
  ControlContainer,
  GeneralIcon,
  Input,
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
          <ControlContainer>
            <div styleName="radio-group">
              <CheckableContainer>
                <Radio value="true" {...register("value")}/>
                <CheckableLabel>{trans("label.enableAdvancedWord.true")}</CheckableLabel>
              </CheckableContainer>
              <CheckableContainer>
                <Radio value="false" {...register("value")}/>
                <CheckableLabel>{trans("label.enableAdvancedWord.false")}</CheckableLabel>
              </CheckableContainer>
            </div>
          </ControlContainer>
        ) : (propertyName === "enableProposal") ? (
          <ControlContainer>
            <div styleName="radio-group">
              <CheckableContainer>
                <Radio value="true" {...register("value")}/>
                <CheckableLabel>{trans("label.enableProposal.true")}</CheckableLabel>
              </CheckableContainer>
              <CheckableContainer>
                <Radio value="false" {...register("value")}/>
                <CheckableLabel>{trans("label.enableProposal.false")}</CheckableLabel>
              </CheckableContainer>
            </div>
          </ControlContainer>
        ) : (propertyName === "enableMarkdown") ? (
          <ControlContainer>
            <div styleName="radio-group">
              <CheckableContainer>
                <Radio value="true" {...register("value")}/>
                <CheckableLabel>{trans("label.enableMarkdown.true")}</CheckableLabel>
              </CheckableContainer>
              <CheckableContainer>
                <Radio value="false" {...register("value")}/>
                <CheckableLabel>{trans("label.enableMarkdown.false")}</CheckableLabel>
              </CheckableContainer>
            </div>
          </ControlContainer>
        ) : (propertyName === "enableDuplicateName") ? (
          <ControlContainer>
            <div styleName="radio-group">
              <CheckableContainer>
                <Radio value="true" {...register("value")}/>
                <CheckableLabel>{trans("label.enableDuplicateName.true")}</CheckableLabel>
              </CheckableContainer>
              <CheckableContainer>
                <Radio value="false" {...register("value")}/>
                <CheckableLabel>{trans("label.enableDuplicateName.false")}</CheckableLabel>
              </CheckableContainer>
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
          <ControlContainer>
            <div styleName="radio-group">
              <CheckableContainer>
                <Radio value="true" {...register("value")}/>
                <CheckableLabel>{trans("label.showVariationPronunciation.true")}</CheckableLabel>
              </CheckableContainer>
              <CheckableContainer>
                <Radio value="false" {...register("value")}/>
                <CheckableLabel>{trans("label.showVariationPronunciation.false")}</CheckableLabel>
              </CheckableContainer>
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