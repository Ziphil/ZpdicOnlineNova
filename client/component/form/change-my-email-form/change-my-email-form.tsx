/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {DetailedUser} from "/client/skeleton";
import {useChangeMyEmail} from "./change-my-email-form-hook";


export const ChangeMyEmailForm = create(
  require("../common.scss"), "ChangeMyEmailForm",
  function ({
    me,
    ...rest
  }: {
    me: DetailedUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMyEmailForm");

    const {form, handleSubmit} = useChangeMyEmail(me);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input type="email" autoComplete="email" error={!!getFieldState("email").error} {...register("email")}/>
          <ControlErrorMessage name="email" form={form} trans={trans}/>
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