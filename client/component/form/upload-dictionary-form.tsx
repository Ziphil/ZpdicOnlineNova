//

import {
  Fragment,
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
  useRequest,
  useTrans
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

    const [file, setFile] = useState<File | null>(null);
    const intl = useIntl();
    const {trans} = useTrans("uploadDictionaryForm");
    const {requestFile} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const handleClick = useCallback(async function (): Promise<void> {
      const numberString = number.toString();
      if (file) {
        const response = await requestFile("uploadDictionary", {number: numberString, file}, {useRecaptcha: true});
        if (response.status === 200) {
          addInformationPopup("dictionaryUploaded");
          onSubmit?.();
        }
      }
    }, [number, file, requestFile, onSubmit, addInformationPopup]);

    const validate = function (file: File): string | null {
      return (file.size <= 5 * 1024 * 1024) ? null : PopupUtil.getMessage(intl, "dictionarySizeTooLarge");
    };
    const node = (
      <Fragment>
        <form styleName="root">
          <FileInput inputLabel={trans("file")} validate={validate} onSet={(file) => setFile(file)}/>
          <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
        </form>
        <p styleName="caution">
          {trans("caution")}
        </p>
      </Fragment>
    );
    return node;

  }
);


export default UploadDictionaryForm;