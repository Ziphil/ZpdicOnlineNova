//

import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
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
  DataUtil
} from "/client/util/data";


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
    let inputRef = useRef<HTMLInputElement>(null);
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
        inputRef.current?.focus();
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

    let inputData = DataUtil.create({
      error: errorMessage !== null
    });
    let node = (
      <div styleName="root" className={className}>
        <Tooltip message={errorMessage}>
          <div styleName="root-inner">
            <label styleName="input-container">
              <Label text={inputLabel} variant={(errorMessage === null) ? "normal" : "error"}/>
              <input styleName="input" type="text" value={fileName} readOnly={true} ref={inputRef} {...inputData}/>
            </label>
            <label styleName="button">
              {buttonLabel ?? trans("fileInput.button")}
              <input styleName="original" type="file" onChange={handleChange}/>
            </label>
          </div>
        </Tooltip>
      </div>
    );
    return node;

  }
);


export default FileInput;