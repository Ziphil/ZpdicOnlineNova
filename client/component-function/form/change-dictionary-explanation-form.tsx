//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component-function/atom/button";
import TextArea from "/client/component-function/atom/text-area";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";


const ChangeDictionaryExplanationForm = create(
  require("./change-dictionary-explanation-form.scss"), "ChangeDictionaryExplanationForm",
  function ({
    number,
    currentExplanation,
    onSubmit
  }: {
    number: number,
    currentExplanation: string | undefined,
    onSubmit?: () => void
  }): ReactElement {

    let [explanation, setExplanation] = useState(currentExplanation ?? "");
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeDictionaryExplanation", {number, explanation});
      if (response.status === 200) {
        addInformationPopup("dictionaryExplanationChanged");
        onSubmit?.();
      }
    }, [number, explanation, request, onSubmit, addInformationPopup]);

    let node = (
      <form styleName="root">
        <TextArea
          label={trans("changeDictionaryExplanationForm.explanation")}
          font="monospace"
          language="markdown"
          nowrap={true}
          value={explanation}
          onSet={(explanation) => setExplanation(explanation)}
        />
        <Button label={trans("changeDictionaryExplanationForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeDictionaryExplanationForm;