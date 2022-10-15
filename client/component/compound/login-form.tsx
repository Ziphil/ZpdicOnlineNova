//

import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useLogin,
  usePath,
  usePopup
} from "/client/component/hook";


const LoginForm = create(
  require("./login-form.scss"), "LoginForm",
  function ({
    showRegister
  }: {
    showRegister: boolean
  }): ReactElement {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const login = useLogin();
    const [, {trans}] = useIntl();
    const {pushPath, replacePath} = usePath();
    const [, {addErrorPopup}] = usePopup();

    const performLogin = useCallback(async function (): Promise<void> {
      const response = await login({name, password}, {ignoreError: true});
      if (response.status === 200) {
        replacePath("/dashboard");
      } else {
        addErrorPopup("loginFailed");
      }
    }, [name, password, login, replacePath, addErrorPopup]);

    const jumpRegister = useCallback(async function (): Promise<void> {
      pushPath("/register", {search: {name, password}});
    }, [name, password, pushPath]);

    const jumpResetPassword = useCallback(async function (): Promise<void> {
      pushPath("/reset", {search: {name}});
    }, [name, pushPath]);

    const node = (
      <form styleName="root">
        <Input label={trans("loginForm.userName")} value={name} onSet={(name) => setName(name)}/>
        <Input label={trans("loginForm.password")} type="flexible" value={password} onSet={(password) => setPassword(password)}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans("loginForm.confirm")} iconName="sign-in-alt" scheme="blue" reactive={true} onClick={performLogin}/>
            {(showRegister) && (
              <Button label={trans("registerForm.confirm")} iconName="user-plus" variant="simple" onClick={jumpRegister}/>
            )}
          </div>
          <div styleName="row">
            <Button label={trans("loginForm.resetPassword")} iconName="question" variant="simple" onClick={jumpResetPassword}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default LoginForm;