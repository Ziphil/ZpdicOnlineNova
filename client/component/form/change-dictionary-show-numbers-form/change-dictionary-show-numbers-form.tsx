//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableCard, CheckableCardBody, ControlContainer, ControlLabel, GeneralIcon, Radio, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
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
            <CheckableCard styleName="card">
              <Radio value="true" {...register("section")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.true")}</div>
                </div>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="false" {...register("section")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.false")}</div>
                </div>
              </CheckableCardBody>
            </CheckableCard>
          </div>
        </ControlContainer>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.equivalent")}</ControlLabel>
          <div styleName="card-group">
            <CheckableCard styleName="card">
              <Radio value="true" {...register("equivalent")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.true")}</div>
                </div>
              </CheckableCardBody>
            </CheckableCard>
            <CheckableCard styleName="card">
              <Radio value="false" {...register("equivalent")}/>
              <CheckableCardBody styleName="card-body">
                <div styleName="label">
                  <div styleName="label-main">{trans("label.false")}</div>
                </div>
              </CheckableCardBody>
            </CheckableCard>
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