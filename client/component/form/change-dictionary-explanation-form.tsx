//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import TextArea from "/client/component/atom/text-area";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";


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

    const [explanation, setExplanation] = useState(currentExplanation ?? "");
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const response = await request("changeDictionaryExplanation", {number, explanation});
      if (response.status === 200) {
        addInformationPopup("dictionaryExplanationChanged");
        onSubmit?.();
      }
    }, [number, explanation, request, onSubmit, addInformationPopup]);

    const node = (
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