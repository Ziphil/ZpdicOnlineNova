/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, PasswordInput, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {DetailedUser} from "/client/skeleton";
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
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <ControlLabel>{trans("label.currentPassword")}</ControlLabel>
          <PasswordInput autoComplete="current-password" error={!!getFieldState("currentPassword").error} {...register("currentPassword")}/>
          <ControlErrorMessage name="currentPassword" form={form} trans={trans}/>
        </ControlContainer>
        <ControlContainer>
          <ControlLabel>{trans("label.newPassword")}</ControlLabel>
          <PasswordInput autoComplete="new-password" error={!!getFieldState("newPassword").error} {...register("newPassword")}/>
          <ControlErrorMessage name="newPassword" form={form} trans={trans}/>
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