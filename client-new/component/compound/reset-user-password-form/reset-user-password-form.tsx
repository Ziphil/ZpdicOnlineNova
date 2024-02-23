//

import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  PasswordInput,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client-new/component/atom/control-container";
import {fakKeyRotate} from "/client-new/component/atom/icon";
import {create} from "/client-new/component/create";
import {useResetUserPassword} from "./reset-user-password-form-hook";


export const ResetUserPasswordForm = create(
  require("./reset-user-password-form.scss"), "ResetUserPasswordForm",
  function ({
    tokenKey,
    ...rest
  }: {
    tokenKey: string,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("resetUserPasswordForm");

    const {form, handleSubmit} = useResetUserPassword(tokenKey);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.password")}</ControlLabel>
            <PasswordInput
              error={getFieldState("password").error !== undefined}
              autoComplete="new-password"
              required={true}
              {...register("password")}
            />
            <ControlErrorMessage name="password" form={form} trans={trans}/>
          </ControlContainer>
        </div>
        <div styleName="button">
          <Button type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={fakKeyRotate}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);