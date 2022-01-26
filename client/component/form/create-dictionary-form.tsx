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
  usePath,
  useRequest
} from "/client/component/hook";


const CreateDictionaryForm = create(
  require("./create-dictionary-form.scss"), "CreateDictionaryForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => void
  }): ReactElement {

    let [name, setName] = useState<string | null>(null);
    let [intl, {trans}] = useIntl();
    let {request} = useRequest();
    let {pushPath} = usePath();

    let handleClick = useCallback(async function (): Promise<void> {
      let actualName = name ?? trans("createDictionaryForm.defaultName");
      let response = await request("createDictionary", {name: actualName});
      if (response.status === 200) {
        let dictionary = response.data;
        onSubmit?.();
        pushPath("/dashboard/dictionary/" + dictionary.number);
      }
    }, [name, request, trans, onSubmit, pushPath]);

    let actualName = name ?? trans("createDictionaryForm.defaultName");
    let node = (
      <form styleName="root">
        <Input label={trans("createDictionaryForm.name")} value={actualName} onSet={(name) => setName(name)}/>
        <Button label={trans("createDictionaryForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default CreateDictionaryForm;