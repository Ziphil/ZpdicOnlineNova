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
import TextArea from "/client/component/atom/text-area";
import {
  create
} from "/client/component/create";
import {
  invalidateQueries,
  usePopup,
  useRequest,
  useTrans
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
    onSubmit?: () => AsyncOrSync<unknown>
  }): ReactElement {

    const [explanation, setExplanation] = useState(currentExplanation ?? "");
    const {trans} = useTrans("changeDictionaryExplanationForm");
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const response = await request("changeDictionaryExplanation", {number, explanation});
      if (response.status === 200) {
        addInformationPopup("dictionaryExplanationChanged");
        await onSubmit?.();
        await invalidateQueries("fetchDictionary", (data) => data.number === number);
      }
    }, [number, explanation, request, onSubmit, addInformationPopup]);

    const node = (
      <form styleName="root">
        <TextArea
          label={trans("explanation")}
          font="monospace"
          language="markdown"
          nowrap={true}
          showButtons={true}
          value={explanation}
          onSet={(explanation) => setExplanation(explanation)}
        />
        <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeDictionaryExplanationForm;