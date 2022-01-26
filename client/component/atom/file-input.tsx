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
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


const FileInput = create(
  require("./file-input.scss"), "FileInput",
  function ({
    file = null,
    inputLabel,
    buttonLabel = null,
    onSet,
    className
  }: {
    file?: File | null,
    inputLabel?: string,
    buttonLabel?: string | null,
    onSet?: (file: File | null) => void,
    className?: string
  }): ReactElement {

    let [fileName, setFileName] = useState("");
    let [, {trans}] = useIntl();

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      let files = event.target.files;
      if (files && files.length > 0) {
        let file = files[0];
        let fileName = file.name;
        setFileName(fileName);
        onSet?.(file);
      }
    }, [onSet]);

    useEffect(() => {
      let fileName = file?.name ?? "";
      setFileName(fileName);
    }, [file]);

    let node = (
      <div styleName="root" className={className}>
        <label styleName="input-wrapper">
          <Label text={inputLabel}/>
          <input styleName="input" type="text" value={fileName} readOnly={true}/>
        </label>
        <label styleName="button">
          {buttonLabel ?? trans("fileInput.button")}
          <input styleName="file" type="file" onChange={handleChange}/>
        </label>
      </div>
    );
    return node;

  }
);


export default FileInput;