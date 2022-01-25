//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component-function/atom/button";
import FileInput from "/client/component-function/atom/file-input";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component-function/hook";


const UploadDictionaryForm = create(
  require("./upload-dictionary-form.scss"), "UploadDictionaryForm",
  function ({
    number,
    onSubmit
  }: {
    number: number,
    onSubmit?: () => void
  }): ReactElement {

    let [file, setFile] = useState<File | null>(null);
    let [, {trans}] = useIntl();
    let {requestFile} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let numberString = number.toString();
      if (file) {
        let response = await requestFile("uploadDictionary", {number: numberString, file}, {useRecaptcha: true});
        if (response.status === 200) {
          addInformationPopup("dictionaryUploaded");
          onSubmit?.();
        }
      }
    }, [number, file, requestFile, onSubmit, addInformationPopup]);

    let node = (
      <form styleName="root">
        <FileInput inputLabel={trans("uploadDictionaryForm.file")} onSet={(file) => setFile(file)}/>
        <Button label={trans("uploadDictionaryForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default UploadDictionaryForm;