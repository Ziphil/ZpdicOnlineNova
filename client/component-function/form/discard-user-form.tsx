//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import Alert from "/client/component-function/atom/alert";
import Button from "/client/component-function/atom/button";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  useLogout,
  usePopup,
  useRequest
} from "/client/component-function/hook";


const DiscardUserForm = create(
  require("./discard-user-form.scss"), "DiscardUserForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => void
  }): ReactElement {

    let [alertOpen, setAlertOpen] = useState(false);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let logout = useLogout();
    let [, {addInformationPopup}] = usePopup();

    let discardUser = useCallback(async function (): Promise<void> {
      let response = await request("discardUser", {});
      if (response.status === 200) {
        addInformationPopup("userDiscarded");
        await logout();
        onSubmit?.();
      }
    }, [request, logout, onSubmit, addInformationPopup]);

    let node = (
      <Fragment>
        <form styleName="root">
          <Button label={trans("discardUserForm.confirm")} reactive={true} style="caution" onClick={() => setAlertOpen(true)}/>
        </form>
        <p styleName="caution">
          {trans("discardUserForm.caution")}
        </p>
        <Alert
          text={trans("discardUserForm.alert")}
          confirmLabel={trans("discardUserForm.confirm")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardUser}
        />
      </Fragment>
    );
    return node;

  }
);


export default DiscardUserForm;