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
import {
  mergeRefs
} from "/client/util/ref";


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
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [autoElement, setAutoElement] = useState<HTMLInputElement | null>(null);
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
    }, [file]);

    const inputData = DataUtil.create({
      error: errorMessage !== null
    });
    const node = (
      <div styleName="root" className={className}>
        <div styleName="root-inner" ref={setReferenceElement}>
          <label styleName="input-container">
            <Label text={inputLabel} variant={(errorMessage === null) ? "normal" : "error"}/>
            <input styleName="input" type="text" value={fileName} readOnly={true} ref={mergeRefs([inputRef, setAutoElement])} {...inputData}/>
          </label>
          <label styleName="button">
            {buttonLabel ?? trans("fileInput.button")}
            <input styleName="original" type="file" onChange={handleChange}/>
          </label>
        </div>
        <Tooltip showArrow={true} fillWidth={true} autoMode="focus" referenceElement={referenceElement} autoElement={autoElement}>
          {errorMessage}
        </Tooltip>
      </div>
    );
    return node;

  }
);


export default FileInput;