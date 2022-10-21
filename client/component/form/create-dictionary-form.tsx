//

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
  usePath,
  useRequest,
  useTrans
} from "/client/component/hook";


const CreateDictionaryForm = create(
  require("./create-dictionary-form.scss"), "CreateDictionaryForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => void
  }): ReactElement {

    const [name, setName] = useState<string | null>(null);
    const {trans} = useTrans("createDictionaryForm");
    const {request} = useRequest();
    const {pushPath} = usePath();

    const handleClick = useCallback(async function (): Promise<void> {
      const actualName = name ?? trans("defaultName");
      const response = await request("createDictionary", {name: actualName});
      if (response.status === 200) {
        const dictionary = response.data;
        onSubmit?.();
        pushPath("/dashboard/dictionary/" + dictionary.number);
      }
    }, [name, request, trans, onSubmit, pushPath]);

    const actualName = name ?? trans("defaultName");
    const node = (
      <form styleName="root">
        <Input label={trans("name")} value={actualName} onSet={(name) => setName(name)}/>
        <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default CreateDictionaryForm;