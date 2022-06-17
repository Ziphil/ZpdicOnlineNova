//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";


const ActivateUserForm = create(
  require("./activate-user-form.scss"), "ActivateUserForm",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const issueActivateToken = useCallback(async function (): Promise<void> {
      const response = await request("issueUserActivateToken", {}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("userActivateTokenIssued");
      }
    }, [request, addInformationPopup]);

    const node = (
      <form styleName="root">
        <div styleName="caution">
          {trans("activateUserForm.caution")}
        </div>
        <div styleName="button-container">
          <Button label={trans("activateUserForm.send")} reactive={false} onClick={issueActivateToken}/>
        </div>
      </form>
    );
    return node;

  }
);


export default ActivateUserForm;