//

import {faArrowRightToBracket, faQuestion, faUserPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  LinkIconbag,
  PasswordInput,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client-new/component/atom/control-container";
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";
import {useLogin} from "./login-form-hook";


export const LoginForm = create(
  require("./login-form.scss"), "LoginForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("loginForm");

    const {form, handleSubmit} = useLogin();
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
            <ControlLabel>{trans("label.password")}</ControlLabel>
            <PasswordInput
              error={getFieldState("password").error !== undefined}
              autoComplete="current-password"
              required={true}
              {...register("password")}
            />
            <ControlErrorMessage name="password" form={form} trans={trans}/>
          </ControlContainer>
        </div>
        <div styleName="button">
          <Button type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faArrowRightToBracket}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
          <Link href="/reset" scheme="secondary" variant="underline">
            <LinkIconbag><GeneralIcon icon={faQuestion}/></LinkIconbag>
            {trans("button.resetPassword")}
          </Link>
        </div>
        <div styleName="separator" role="separator">
          {trans("or")}
        </div>
        <div styleName="button">
          <Link href="/register" variant="light">
            <LinkIconbag><GeneralIcon icon={faUserPlus}/></LinkIconbag>
            {trans("button.register")}
          </Link>
        </div>
      </form>
    );

  }
);