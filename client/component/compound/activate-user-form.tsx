//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
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

    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let issueActivateToken = useCallback(async function (): Promise<void> {
      let response = await request("issueUserActivateToken", {}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("userActivateTokenIssued");
      }
    }, [request, addInformationPopup]);

    let node = (
      <form styleName="root">
        <div styleName="caution">
          {trans("activateUserForm.caution")}
        </div>
        <div styleName="button">
          <Button label={trans("activateUserForm.send")} reactive={false} onClick={issueActivateToken}/>
        </div>
      </form>
    );
    return node;

  }
);


export default ActivateUserForm;