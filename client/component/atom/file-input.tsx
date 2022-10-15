//

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


export const FileInput = create(
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

    const [fileName, setFileName] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [, {trans}] = useIntl();

    const handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fileName = file.name;
        if (validate !== undefined) {
          const errorMessage = validate(file);
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
      const fileName = file?.name ?? "";
      if (file !== null && validate !== undefined) {
        const errorMessage = validate(file);
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(null);
      }
      setFileName(fileName);
    }, [file, validate]);

    const inputData = DataUtil.create({
      error: errorMessage !== null
    });
    const node = (
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