//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, Input, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
import {useChangeDictionaryWordCardTitles} from "./change-dictionary-word-card-titles-form-hook";


export const ChangeDictionaryWordCardTitlesForm = create(
  require("./change-dictionary-word-card-titles-form.scss"), "ChangeDictionaryWordCardTitlesForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryWordCardTitlesForm");

    const {form, handleSubmit} = useChangeDictionaryWordCardTitles(dictionary);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <ControlLabel>{trans("label.phrase")}</ControlLabel>
          <Input error={!!getFieldState("phrase").error} {...register("phrase")}/>
          <ControlErrorMessage name="phrase" form={form} trans={trans}/>
        </ControlContainer>
        <ControlContainer>
          <ControlLabel>{trans("label.example")}</ControlLabel>
          <Input error={!!getFieldState("example").error} {...register("example")}/>
          <ControlErrorMessage name="example" form={form} trans={trans}/>
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