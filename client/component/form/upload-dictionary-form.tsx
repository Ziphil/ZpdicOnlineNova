//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import FileInput from "/client/component/atom/file-input";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  PopupUtil
} from "/client/util/popup";


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
    let [intl, {trans}] = useIntl();
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

    let validate = function (file: File): string | null {
      if (file.size <= 5 * 1024 * 1024) {
        return null;
      } else {
        return PopupUtil.getMessage(intl, "dictionarySizeTooLarge");
      }
    };
    let node = (
      <form styleName="root">
        <FileInput inputLabel={trans("uploadDictionaryForm.file")} validate={validate} onSet={(file) => setFile(file)}/>
        <Button label={trans("uploadDictionaryForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default UploadDictionaryForm;