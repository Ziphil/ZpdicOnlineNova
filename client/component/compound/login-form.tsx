//

import * as react from "react";
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

    let [name, setName] = useState("");
    let [password, setPassword] = useState("");
    let login = useLogin();
    let [, {trans}] = useIntl();
    let {pushPath, replacePath} = usePath();
    let [, {addErrorPopup}] = usePopup();

    let performLogin = useCallback(async function (): Promise<void> {
      let response = await login({name, password}, {ignoreError: true});
      if (response.status === 200) {
        replacePath("/dashboard");
      } else {
        addErrorPopup("loginFailed");
      }
    }, [name, password, login, replacePath, addErrorPopup]);

    let jumpRegister = useCallback(async function (): Promise<void> {
      pushPath("/register", {name, password});
    }, [name, password, pushPath]);

    let jumpResetPassword = useCallback(async function (): Promise<void> {
      pushPath("/reset", {name});
    }, [name, pushPath]);

    let registerNode = (showRegister) && (
      <Button label={trans("registerForm.confirm")} iconLabel="&#xF234;" style="simple" onClick={jumpRegister}/>
    );
    let node = (
      <form styleName="root">
        <Input label={trans("loginForm.userName")} value={name} onSet={(name) => setName(name)}/>
        <Input label={trans("loginForm.password")} type="flexible" value={password} onSet={(password) => setPassword(password)}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans("loginForm.confirm")} iconLabel="&#xF2F6;" style="information" reactive={true} onClick={performLogin}/>
            {registerNode}
          </div>
          <div styleName="row">
            <Button label={trans("loginForm.resetPassword")} iconLabel="&#xF128;" style="simple" onClick={jumpResetPassword}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default LoginForm;