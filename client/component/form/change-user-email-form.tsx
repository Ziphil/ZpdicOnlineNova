//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  create
} from "/client/component/create";
import {
  useIntl,
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
  EMAIL_REGEXP
} from "/server/model/validation";


const ChangeUserEmailForm = create(
  require("./change-user-email-form.scss"), "ChangeUserEmailForm",
  function ({
    currentEmail,
    onSubmit
  }: {
    currentEmail: string,
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [email, setEmail] = useState(currentEmail);
    const [intl, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const response = await request("changeUserEmail", {email});
      if (response.status === 200) {
        addInformationPopup("userEmailChanged");
        await onSubmit?.();
      }
    }, [email, request, onSubmit, addInformationPopup]);

    const validate = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(intl, "invalidUserEmail"));
    const node = (
      <form styleName="root">
        <Input label={trans("changeUserEmailForm.email")} value={email} validate={validate} useTooltip={true} onSet={(email) => setEmail(email)}/>
        <Button label={trans("changeUserEmailForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeUserEmailForm;