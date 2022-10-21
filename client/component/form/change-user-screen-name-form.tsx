//

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
  usePopup,
  useRequest,
  useTrans
} from "/client/component/hook";


const ChangeUserScreenNameForm = create(
  require("./change-user-screen-name-form.scss"), "ChangeUserScreenNameForm",
  function ({
    currentScreenName,
    onSubmit
  }: {
    currentScreenName: string | undefined,
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [screenName, setScreenName] = useState(currentScreenName ?? "");
    const {trans} = useTrans("changeUserScreenNameForm");
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const response = await request("changeUserScreenName", {screenName});
      if (response.status === 200) {
        addInformationPopup("userScreenNameChanged");
        await onSubmit?.();
      }
    }, [screenName, request, onSubmit, addInformationPopup]);

    const node = (
      <form styleName="root">
        <Input label={trans("screenName")} value={screenName} onSet={(screenName) => setScreenName(screenName)}/>
        <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeUserScreenNameForm;