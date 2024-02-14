/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, PasswordInput, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedUser} from "/client-new/skeleton";
import {useChangeMyPassword} from "./change-my-password-form-hook";


export const ChangeMyPasswordForm = create(
  require("../common.scss"), "ChangeMyPasswordForm",
  function ({
    me,
    ...rest
  }: {
    me: DetailedUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMyPasswordForm");

    const {form, handleSubmit} = useChangeMyPassword(me);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <ControlLabel>{trans("label.currentPassword")}</ControlLabel>
          <PasswordInput autoComplete="current-password" {...register("currentPassword")}/>
        </ControlContainer>
        <ControlContainer>
          <ControlLabel>{trans("label.newPassword")}</ControlLabel>
          <PasswordInput autoComplete="new-password" {...register("newPassword")}/>
        </ControlContainer>
        <div>
          <Button onClick={handleSubmit} variant="light">
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);