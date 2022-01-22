//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component-function/atom/button";
import Input from "/client/component-function/atom/input";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";
import {
  createValidate
} from "/client/util/misc";
import {
  PopupUtil
} from "/client/util/popup";
import {
  EMAIL_REGEXP
} from "/server/model/validation";


const ChangeUserEmailForm = create(
  require("./change-user-email-form.scss"), "ChangeUserEmailForm",
  function ({
    currentEmail,
    onSubmit
  }: {
    currentEmail: string,
    onSubmit?: () => void
  }): ReactElement {

    let [email, setEmail] = useState(currentEmail);
    let {request} = useRequest();
    let [intl, {trans}] = useIntl();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeUserEmail", {email});
      if (response.status === 200) {
        addInformationPopup("userEmailChanged");
        onSubmit?.();
      }
    }, [email, request, addInformationPopup, onSubmit]);

    let validate = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(intl, "invalidUserEmail"));
    let node = (
      <form styleName="root">
        <Input label={trans("changeUserEmailForm.email")} value={email} validate={validate} useTooltip={true} onSet={(email) => setEmail(email)}/>
        <Button label={trans("changeUserEmailForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeUserEmailForm;