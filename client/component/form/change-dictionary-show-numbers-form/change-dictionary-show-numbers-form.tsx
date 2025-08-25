//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableContainer, CheckableLabel, ControlContainer, ControlLabel, GeneralIcon, Radio, useTrans} from "zographia";
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
        <ControlContainer>
          <ControlLabel>{trans("label.section")}</ControlLabel>
          <div styleName="radio-group">
            <CheckableContainer>
              <Radio value="true" {...register("section")}/>
              <CheckableLabel>{trans("label.true")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="false" {...register("section")}/>
              <CheckableLabel>{trans("label.false")}</CheckableLabel>
            </CheckableContainer>
          </div>
        </ControlContainer>
        <ControlContainer>
          <ControlLabel>{trans("label.equivalent")}</ControlLabel>
          <div styleName="radio-group">
            <CheckableContainer>
              <Radio value="true" {...register("equivalent")}/>
              <CheckableLabel>{trans("label.true")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="false" {...register("equivalent")}/>
              <CheckableLabel>{trans("label.false")}</CheckableLabel>
            </CheckableContainer>
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