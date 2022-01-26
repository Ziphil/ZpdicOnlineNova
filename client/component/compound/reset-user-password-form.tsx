//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useLocation
} from "react-router-dom";
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
  validatePassword as rawValidatePassword
} from "/server/model/validation";


const ResetUserPasswordForm = create(
  require("./reset-user-password-form.scss"), "ResetUserPasswordForm",
  function ({
    tokenKey
  }: {
    tokenKey: string | null
  }): ReactElement {

    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let {request} = useRequest();
    let [intl, {trans}] = useIntl();
    let {pushPath} = usePath();
    let location = useLocation<any>();
    let [, {addInformationPopup}] = usePopup();

    let issueResetToken = useCallback(async function (): Promise<void> {
      let response = await request("issueUserResetToken", {name, email}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("userResetTokenIssued");
        pushPath("/", undefined, true);
      }
    }, [name, email, request, pushPath, addInformationPopup]);

    let resetPassword = useCallback(async function (): Promise<void> {
      let response = await request("resetUserPassword", {key: tokenKey!, password});
      if (response.status === 200) {
        addInformationPopup("userPasswordReset");
        pushPath("/", undefined, true);
      }
    }, [tokenKey, password, request, pushPath, addInformationPopup]);

    useMount(() => {
      let name = location.state.name;
      if (name !== undefined) {
        setName(name);
      }
    });

    if (tokenKey !== null) {
      let validate = createValidate(rawValidatePassword, PopupUtil.getMessage(intl, "invalidUserPassword"));
      let node = (
        <form styleName="root">
          <Input label={trans("resetUserPasswordForm.newPassword")} value={password} validate={validate} onSet={(password) => setPassword(password)}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={trans("resetUserPasswordForm.reset")} iconName="check" style="information" reactive={true} onClick={resetPassword}/>
            </div>
          </div>
        </form>
      );
      return node;
    } else {
      let node = (
        <form styleName="root">
          <Input label={trans("loginForm.userName")} value={name} onSet={(name) => setName(name)}/>
          <Input label={trans("loginForm.email")} value={email} onSet={(email) => setEmail(email)}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={trans("resetUserPasswordForm.issue")} iconName="envelope" style="information" reactive={true} onClick={issueResetToken}/>
            </div>
          </div>
        </form>
      );
      return node;
    }

  }
);


export default ResetUserPasswordForm;