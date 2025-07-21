//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useHref} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, InputAddon, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
import {useChangeDictionaryParamName} from "./change-dictionary-param-name-form-hook";


export const ChangeDictionaryParamNameForm = create(
  require("./change-dictionary-param-name-form.scss"), "ChangeDictionaryParamNameForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryParamNameForm");

    const {form, handleSubmit} = useChangeDictionaryParamName(dictionary);
    const {register, getFieldState, formState: {errors}} = form;

    const prefix = location.host + useHref("/dictionary/");

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input styleName="input" placeholder={dictionary.number.toString()} error={!!getFieldState("paramName").error} {...register("paramName")}>
            <InputAddon styleName="prefix" position="left" hasGap={false}>{prefix}</InputAddon>
          </Input>
          <ControlErrorMessage name="paramName" form={form} trans={trans}/>
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