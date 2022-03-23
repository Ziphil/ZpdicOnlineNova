//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useLocation,
  useLogin,
  usePath,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  createValidate
} from "/client/util/misc";
import {
  PopupUtil
} from "/client/util/popup";
import {
  EMAIL_REGEXP,
  IDENTIFIER_REGEXP,
  validatePassword as rawValidatePassword
} from "/server/model/validation";


const RegisterForm = create(
  require("./register-form.scss"), "RegisterForm",
  function ({
  }: {
  }): ReactElement {

    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let {request} = useRequest();
    let login = useLogin();
    let [intl, {trans}] = useIntl();
    let {replacePath} = usePath();
    let location = useLocation();
    let [, {addErrorPopup}] = usePopup();

    let performRegister = useCallback(async function (): Promise<void> {
      let response = await request("registerUser", {name, email, password}, {useRecaptcha: true});
      let body = response.data;
      if (response.status === 200) {
        let loginResponse = await login({name, password});
        if (loginResponse.status === 200) {
          replacePath("/dashboard");
        } else {
          addErrorPopup("loginFailed");
        }
      }
    }, [name, email, password, request, login, replacePath, addErrorPopup]);

    useMount(() => {
      let name = location.search.name;
      let password = location.search.password;
      if (typeof name === "string" && typeof password === "string") {
        setName(name);
        setPassword(password);
      }
    });

    let validateName = createValidate(IDENTIFIER_REGEXP, PopupUtil.getMessage(intl, "invalidUserName"));
    let validateEmail = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(intl, "invalidUserEmail"));
    let validatePassword = createValidate(rawValidatePassword, PopupUtil.getMessage(intl, "invalidUserPassword"));
    let node = (
      <form styleName="root">
        <Input label={trans("loginForm.userName")} value={name} validate={validateName} onSet={(name) => setName(name)}/>
        <Input label={trans("loginForm.email")} value={email} validate={validateEmail} onSet={(email) => setEmail(email)}/>
        <Input label={trans("loginForm.password")} type="flexible" value={password} validate={validatePassword} onSet={(password) => setPassword(password)}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans("registerForm.confirm")} iconName="user-plus" variant="information" reactive={true} onClick={performRegister}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default RegisterForm;