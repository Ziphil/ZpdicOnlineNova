//

import {faUserPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableContainer,
  CheckableLabel,
  Checkbox,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  PasswordInput,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client-new/component/atom/control-container";
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";
import {useRegisterUser} from "./register-form-hook";


export const RegisterForm = create(
  require("./register-form.scss"), "RegisterForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("registerForm");

    const {form, handleSubmit} = useRegisterUser();
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.name")}</ControlLabel>
            <Input
              error={getFieldState("name").error !== undefined}
              autoFocus={true}
              autoComplete="username"
              required={true}
              {...register("name")}
            />
            <ControlErrorMessage name="name" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.email")}</ControlLabel>
            <Input
              error={getFieldState("email").error !== undefined}
              type="email"
              autoComplete="email"
              required={true}
              {...register("email")}
            />
            <ControlErrorMessage name="email" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.password")}</ControlLabel>
            <PasswordInput
              error={getFieldState("password").error !== undefined}
              autoComplete="current-password"
              required={true}
              {...register("password")}
            />
            <ControlErrorMessage name="password" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <CheckableContainer>
              <Checkbox
                error={getFieldState("agree").error !== undefined}
                required={true}
                {...register("agree")}
              />
              <CheckableLabel>
                {transNode("label.agree", {
                  link: (parts) => <Link href="/document/other/privacy" scheme="secondary" variant="underline" target="_blank">{parts}</Link>
                })}
              </CheckableLabel>
            </CheckableContainer>
            <ControlErrorMessage name="agree" form={form} trans={trans}/>
          </ControlContainer>
        </div>
        <div styleName="button">
          <Button type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faUserPlus}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);