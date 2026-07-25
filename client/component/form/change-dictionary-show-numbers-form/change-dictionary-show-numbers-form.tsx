//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableCard, CheckableCardBody, ControlContainer, ControlLabel, GeneralIcon, MultiLineText, Radio, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DICTIONARY_NUMBER_MODES, Dictionary} from "/server/internal/skeleton";
import {useChangeDictionaryShowNumbers} from "./change-dictionary-show-numbers-form-hook";


export const ChangeDictionaryShowNumbersForm = create(
  require("./change-dictionary-show-numbers-form.scss"), "ChangeDictionaryShowNumbersForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryShowNumbersForm");

    const {form, handleSubmit} = useChangeDictionaryShowNumbers(dictionary);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.section")}</ControlLabel>
          <div styleName="card-group">
            {DICTIONARY_NUMBER_MODES.map((mode) => (
              <CheckableCard styleName="card" key={mode}>
                <Radio value={mode} {...register("section")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans(`label.${mode}`)}</div>
                    {mode === "onlyNecessary" && (
                      <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.onlyNecessary.section")}</MultiLineText>
                    )}
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            ))}
          </div>
        </ControlContainer>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.equivalent")}</ControlLabel>
          <div styleName="card-group">
            {DICTIONARY_NUMBER_MODES.map((mode) => (
              <CheckableCard styleName="card" key={mode}>
                <Radio value={mode} {...register("equivalent")}/>
                <CheckableCardBody styleName="card-body">
                  <div styleName="label">
                    <div styleName="label-main">{trans(`label.${mode}`)}</div>
                    {mode === "onlyNecessary" && (
                      <MultiLineText styleName="label-helper" lineHeight="narrow">{trans("labelHelper.onlyNecessary.equivalent")}</MultiLineText>
                    )}
                  </div>
                </CheckableCardBody>
              </CheckableCard>
            ))}
          </div>
        </ControlContainer>
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