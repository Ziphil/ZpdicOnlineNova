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
  invalidateQueries,
  usePopup,
  useRequest,
  useTrans
} from "/client/component/hook";


const ChangeDictionaryNameForm = create(
  require("./change-dictionary-name-form.scss"), "ChangeDictionaryNameForm",
  function ({
    number,
    currentName,
    onSubmit
  }: {
    number: number,
    currentName: string,
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [name, setName] = useState(currentName);
    const {trans} = useTrans("changeDictionaryName");
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const response = await request("changeDictionaryName", {number, name});
      if (response.status === 200) {
        addInformationPopup("dictionaryNameChanged");
        await onSubmit?.();
        await invalidateQueries("fetchDictionary", (data) => data.number === number);
      }
    }, [number, name, request, onSubmit, addInformationPopup]);

    const node = (
      <form styleName="root">
        <Input label={trans("name")} value={name} onSet={(name) => setName(name)}/>
        <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeDictionaryNameForm;