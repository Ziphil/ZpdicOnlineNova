//

import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  usePopup,
  useRequest,
  useTrans
} from "/client/component/hook";


const ActivateUserForm = create(
  require("./activate-user-form.scss"), "ActivateUserForm",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("activateUserForm");
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    const issueActivateToken = useCallback(async function (): Promise<void> {
      const response = await request("issueUserActivateToken", {}, {useRecaptcha: true});
      if (response.status === 200) {
        addInformationPopup("userActivateTokenIssued");
      }
    }, [request, addInformationPopup]);

    const node = (
      <form styleName="root">
        <div styleName="caution">
          {trans("caution")}
        </div>
        <div styleName="button-container">
          <Button label={trans("send")} variant="light" scheme="red" reactive={false} onClick={issueActivateToken}/>
        </div>
      </form>
    );
    return node;

  }
);


export default ActivateUserForm;