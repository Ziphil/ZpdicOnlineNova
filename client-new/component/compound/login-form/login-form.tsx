/* eslint-disable react/jsx-closing-bracket-location */

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
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";


export const LoginForm = create(
  require("./login-form.scss"), "LoginForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("loginForm");

    return (
      <form styleName="root" {...rest}>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.userName")}</ControlLabel>
            <Input
              autoFocus={true}
              autoComplete="username"
              required={true}
            />
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.password")}</ControlLabel>
            <PasswordInput
              autoComplete="current-password"
              required={true}
            />
          </ControlContainer>
        </div>
        <div styleName="button">
          <Button type="submit">
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