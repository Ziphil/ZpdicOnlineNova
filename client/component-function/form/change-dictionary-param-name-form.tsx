//

import * as react from "react";
import {
  Fragment,
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
import {
  PopupUtil
} from "/client/util/popup";
import {
  IDENTIFIER_REGEXP
} from "/server/model/validation";


const ChangeDictionaryParamNameForm = create(
  require("./change-dictionary-param-name-form.scss"), "ChangeDictionaryParamNameForm",
  function ({
    number,
    currentParamName,
    onSubmit
  }: {
    number: number,
    currentParamName: string | undefined,
    onSubmit?: () => void
  }): ReactElement {

    let [paramName, setParamName] = useState(currentParamName ?? "");
    let [intl, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeDictionaryParamName", {number, paramName});
      if (response.status === 200) {
        addInformationPopup("dictionaryParamNameChanged");
        onSubmit?.();
      }
    }, [number, paramName, request, onSubmit, addInformationPopup]);

    let nextUrl = "http://zpdic.ziphil.com/dictionary/" + (paramName || number);
    let validate = function (value: string): string | null {
      return (value === "" || value.match(IDENTIFIER_REGEXP)) ? null : PopupUtil.getMessage(intl, "invalidDictionaryParamName");
    };
    let node = (
      <Fragment>
        <form styleName="root">
          <Input label={trans("changeDictionaryParamNameForm.paramName")} value={paramName} validate={validate} onSet={(paramName) => setParamName(paramName)}/>
          <Button label={trans("changeDictionaryParamNameForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
        <p styleName="url">
          {nextUrl}
        </p>
      </Fragment>
    );
    return node;

  }
);


export default ChangeDictionaryParamNameForm;