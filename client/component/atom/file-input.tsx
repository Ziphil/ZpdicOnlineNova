//

import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
import Label from "/client/component/atom/label";
import Tooltip from "/client/component/atom/tooltip";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const FileInput = create(
  require("./file-input.scss"), "FileInput",
  function ({
    file = null,
    inputLabel,
    buttonLabel = null,
    validate,
    onSet,
    className
  }: {
    file?: File | null,
    inputLabel?: string,
    buttonLabel?: string | null,
    validate?: (file: File) => string | null,
    onSet?: (file: File | null) => void,
    className?: string
  }): ReactElement {

    let [fileName, setFileName] = useState("");
    let [errorMessage, setErrorMessage] = useState<string | null>(null);
    let [, {trans}] = useIntl();

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      let files = event.target.files;
      if (files && files.length > 0) {
        let file = files[0];
        let fileName = file.name;
        if (validate !== undefined) {
          let errorMessage = validate(file);
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage(null);
        }
        setFileName(fileName);
        onSet?.(file);
      }
    }, [validate, onSet]);

    useEffect(() => {
      let fileName = file?.name ?? "";
      if (file !== null && validate !== undefined) {
        let errorMessage = validate(file);
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(null);
      }
      setFileName(fileName);
    }, [file]);

    let inputStyleName = StyleNameUtil.create(
      "input",
      {if: errorMessage !== null, true: "error"}
    );
    let node = (
      <div styleName="root" className={className}>
        <Tooltip message={errorMessage}>
          <div>
            <label styleName="input-wrapper">
              <Label text={inputLabel} style={(errorMessage === null) ? "normal" : "error"}/>
              <input styleName={inputStyleName} type="text" value={fileName} readOnly={true}/>
            </label>
            <label styleName="button">
              {buttonLabel ?? trans("fileInput.button")}
              <input styleName="file" type="file" onChange={handleChange}/>
            </label>
          </div>
        </Tooltip>
      </div>
    );
    return node;

  }
);


export default FileInput;