//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import RadioGroup from "/client/component/atom/radio-group";
import {
  create
} from "/client/component/create";
import {
  invalidateQueries,
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";


const ChangeDictionarySecretForm = create(
  require("./change-dictionary-secret-form.scss"), "ChangeDictionarySecretForm",
  function ({
    number,
    currentSecret,
    onSubmit
  }: {
    number: number,
    currentSecret: boolean,
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [secret, setSecret] = useState(currentSecret);
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const response = await request("changeDictionarySecret", {number, secret});
      if (response.status === 200) {
        addInformationPopup("dictionarySecretChanged");
        await onSubmit?.();
        await invalidateQueries("fetchDictionary", (data) => data.number === number);
      }
    }, [number, secret, request, onSubmit, addInformationPopup]);

    const specs = [
      {value: "public", label: trans("changeDictionarySecretForm.public")},
      {value: "secret", label: trans("changeDictionarySecretForm.secret")}
    ];
    const secretValue = (secret) ? "secret" : "public";
    const node = (
      <Fragment>
        <form styleName="root">
          <RadioGroup name="secret" specs={specs} value={secretValue} onSet={(value) => setSecret(value === "secret")}/>
          <Button label={trans("changeDictionarySecretForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
        <p styleName="caution">
          {trans("changeDictionarySecretForm.caution")}
        </p>
      </Fragment>
    );
    return node;

  }
);


export default ChangeDictionarySecretForm;