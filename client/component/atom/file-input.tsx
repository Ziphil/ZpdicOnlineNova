//

import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import Icon from "/client/component/atom/icon";
import Label from "/client/component/atom/label";
import Tooltip from "/client/component/atom/tooltip";
import {
  create
} from "/client/component/create";
import {
  aria,
  data
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
    const [referenceElement, setReferenceElement] = useState<HTMLLabelElement | null>(null);
    const [autoElement, setAutoElement] = useState<HTMLInputElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const node = (
      <div styleName="root" className={className}>
        <label styleName="label-container" ref={setReferenceElement} {...data({error: errorMessage !== null})}>
          <Label text={inputLabel} variant={(errorMessage === null) ? "normal" : "error"}/>
          <input styleName="original" type="file" ref={mergeRefs([inputRef, setAutoElement])} onChange={handleChange}/>
          <div styleName="input-container" {...aria({hidden: true})}>
            <div styleName="input">{fileName}</div>
            <div styleName="button"><Icon name="ellipsis"/></div>
          </div>
        </label>
        <Tooltip showArrow={true} fillWidth={true} autoMode="focus" referenceElement={referenceElement} autoElement={autoElement}>
          {errorMessage}
        </Tooltip>
      </div>
    );
    return node;

  }
);


export default FileInput;