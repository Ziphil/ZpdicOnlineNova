//

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
  useRequest,
  useTrans
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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {request} = useRequest();
    const login = useLogin();
    const intl = useIntl();
    const {trans} = useTrans("registerForm");
    const {replacePath} = usePath();
    const location = useLocation();
    const [, {addErrorPopup}] = usePopup();

    const performRegister = useCallback(async function (): Promise<void> {
      const response = await request("registerUser", {name, email, password}, {useRecaptcha: true});
      const body = response.data;
      if (response.status === 200) {
        const loginResponse = await login({name, password});
        if (loginResponse.status === 200) {
          replacePath("/dashboard");
        } else {
          addErrorPopup("loginFailed");
        }
      }
    }, [name, email, password, request, login, replacePath, addErrorPopup]);

    useMount(() => {
      const name = location.search.name;
      const password = location.search.password;
      if (typeof name === "string" && typeof password === "string") {
        setName(name);
        setPassword(password);
      }
    });

    const validateName = createValidate(IDENTIFIER_REGEXP, PopupUtil.getMessage(intl, "invalidUserName"));
    const validateEmail = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(intl, "invalidUserEmail"));
    const validatePassword = createValidate(rawValidatePassword, PopupUtil.getMessage(intl, "invalidUserPassword"));
    const node = (
      <form styleName="root">
        <Input label={trans("userName")} value={name} validate={validateName} onSet={(name) => setName(name)}/>
        <Input label={trans("email")} value={email} validate={validateEmail} onSet={(email) => setEmail(email)}/>
        <Input label={trans("password")} type="flexible" value={password} validate={validatePassword} onSet={(password) => setPassword(password)}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={trans(":registerForm.confirm")} iconName="user-plus" scheme="blue" reactive={true} onClick={performRegister}/>
          </div>
        </div>
      </form>
    );
    return node;

  }
);


export default RegisterForm;