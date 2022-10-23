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
  useLogout,
  usePopup,
  useRequest,
  useTrans
} from "/client/component/hook";


const DiscardUserForm = create(
  require("./discard-user-form.scss"), "DiscardUserForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [alertOpen, setAlertOpen] = useState(false);
    const {trans} = useTrans("discardUserForm");
    const {request} = useRequest();
    const logout = useLogout();
    const {addInformationPopup} = usePopup();

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
        <p styleName="caution">
          {trans("caution")}
        </p>
        <form styleName="root">
          <Button label={trans("confirm")} reactive={true} scheme="red" onClick={() => setAlertOpen(true)}/>
        </form>
        <Alert
          text={trans("alert")}
          confirmLabel={trans("confirm")}
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