//

import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useLogout,
  usePopup,
  useRequest
} from "/client/component/hook";


const DiscardUserForm = create(
  require("./discard-user-form.scss"), "DiscardUserForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [alertOpen, setAlertOpen] = useState(false);
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const logout = useLogout();
    const [, {addInformationPopup}] = usePopup();

    const discardUser = useCallback(async function (): Promise<void> {
      const response = await request("discardUser", {});
      if (response.status === 200) {
        addInformationPopup("userDiscarded");
        await logout();
        await onSubmit?.();
      }
    }, [request, logout, onSubmit, addInformationPopup]);

    const node = (
      <Fragment>
        <form styleName="root">
          <Button label={trans("discardUserForm.confirm")} reactive={true} scheme="red" onClick={() => setAlertOpen(true)}/>
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