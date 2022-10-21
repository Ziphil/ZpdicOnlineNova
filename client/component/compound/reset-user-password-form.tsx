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
  validatePassword as rawValidatePassword
} from "/server/model/validation";


const ResetUserPasswordForm = create(
  require("./reset-user-password-form.scss"), "ResetUserPasswordForm",
  function ({
    tokenKey
  }: {
    tokenKey: string | null
  }): ReactElement {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {request} = useRequest();
    const [intl] = useIntl();
    const {trans} = useTrans("resetUserPasswordForm");
    const {pushPath} = usePath();
    const location = useLocation();
    const [, {addInformationPopup}] = usePopup();

    const issueResetToken = useCallback(async function (): Promise<void> {
      const response = await request("issueUserResetToken", {name, email}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("userResetTokenIssued");
        pushPath("/", {preservePopup: true});
      }
    }, [name, email, request, pushPath, addInformationPopup]);

    const resetPassword = useCallback(async function (): Promise<void> {
      const response = await request("resetUserPassword", {key: tokenKey!, password});
      if (response.status === 200) {
        addInformationPopup("userPasswordReset");
        pushPath("/", {preservePopup: true});
      }
    }, [tokenKey, password, request, pushPath, addInformationPopup]);

    useMount(() => {
      const name = location.search.name;
      if (typeof name === "string") {
        setName(name);
      }
    });

    if (tokenKey !== null) {
      const validate = createValidate(rawValidatePassword, PopupUtil.getMessage(intl, "invalidUserPassword"));
      const node = (
        <form styleName="root">
          <Input label={trans("newPassword")} value={password} validate={validate} onSet={(password) => setPassword(password)}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={trans("reset")} iconName="check" scheme="blue" reactive={true} onClick={resetPassword}/>
            </div>
          </div>
        </form>
      );
      return node;
    } else {
      const node = (
        <form styleName="root">
          <Input label={trans(":loginForm.userName")} value={name} onSet={(name) => setName(name)}/>
          <Input label={trans(":loginForm.email")} value={email} onSet={(email) => setEmail(email)}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={trans("issue")} iconName="envelope" scheme="blue" reactive={true} onClick={issueResetToken}/>
            </div>
          </div>
        </form>
      );
      return node;
    }

  }
);


export default ResetUserPasswordForm;