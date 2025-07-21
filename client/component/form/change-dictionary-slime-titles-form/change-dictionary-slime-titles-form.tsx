//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, Input, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
import {useChangeDictionarySlimeTitles} from "./change-dictionary-slime-titles-form-hook";


export const ChangeDictionarySlimeTitlesForm = create(
  require("./change-dictionary-slime-titles-form.scss"), "ChangeDictionarySlimeTitlesForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionarySlimeTitlesForm");

    const {form, handleSubmit} = useChangeDictionarySlimeTitles(dictionary);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <ControlLabel>{trans("label.pronunciationTitle")}</ControlLabel>
          <Input error={!!getFieldState("pronunciationTitle").error} {...register("pronunciationTitle")}/>
          <ControlErrorMessage name="pronunciationTitle" form={form} trans={trans}/>
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