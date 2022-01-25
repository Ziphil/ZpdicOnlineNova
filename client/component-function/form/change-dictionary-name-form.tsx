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


const ChangeDictionaryNameForm = create(
  require("./change-dictionary-name-form.scss"), "ChangeDictionaryNameForm",
  function ({
    number,
    currentName,
    onSubmit
  }: {
    number: number,
    currentName: string,
    onSubmit?: () => void
  }): ReactElement {

    let [name, setName] = useState(currentName);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeDictionaryName", {number, name});
      if (response.status === 200) {
        addInformationPopup("dictionaryNameChanged");
        onSubmit?.();
      }
    }, [number, name, request, onSubmit, addInformationPopup]);

    let node = (
      <form styleName="root">
        <Input label={trans("changeDictionaryNameForm.name")} value={name} onSet={(name) => setName(name)}/>
        <Button label={trans("changeDictionaryNameForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeDictionaryNameForm;