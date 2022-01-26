//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
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


const ChangeUserScreenNameForm = create(
  require("./change-user-screen-name-form.scss"), "ChangeUserScreenNameForm",
  function ({
    currentScreenName,
    onSubmit
  }: {
    currentScreenName: string | undefined,
    onSubmit?: () => void
  }): ReactElement {

    let [screenName, setScreenName] = useState(currentScreenName ?? "");
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeUserScreenName", {screenName});
      if (response.status === 200) {
        addInformationPopup("userScreenNameChanged");
        onSubmit?.();
      }
    }, [screenName, request, onSubmit, addInformationPopup]);

    let node = (
      <form styleName="root">
        <Input label={trans("changeUserScreenNameForm.screenName")} value={screenName} onSet={(screenName) => setScreenName(screenName)}/>
        <Button label={trans("changeUserScreenNameForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeUserScreenNameForm;