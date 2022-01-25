//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component-function/atom/button";
import RadioGroup from "/client/component-function/atom/radio-group";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";


const ChangeDictionarySecretForm = create(
  require("./change-dictionary-secret-form.scss"), "ChangeDictionarySecretForm",
  function ({
    number,
    currentSecret,
    onSubmit
  }: {
    number: number,
    currentSecret: boolean,
    onSubmit?: () => void
  }): ReactElement {

    let [secret, setSecret] = useState(currentSecret);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeDictionarySecret", {number, secret});
      if (response.status === 200) {
        addInformationPopup("dictionarySecretChanged");
        onSubmit?.();
      }
    }, [number, secret, request, onSubmit, addInformationPopup]);

    let specs = [
      {value: "public", label: trans("changeDictionarySecretForm.public")},
      {value: "secret", label: trans("changeDictionarySecretForm.secret")}
    ];
    let secretValue = (secret) ? "secret" : "public";
    let node = (
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