//

import * as react from "react";
import {
  ChangeEvent,
  ReactElement,
  useCallback
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import Label from "/client/component-function/atom/label";
import {
  StylesRecord,
  create
} from "/client/component-function/create";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";
import {
  StyleNameUtil
} from "/client/util/style-name";


const TextArea = create(
  require("./text-area.scss"), "TextArea",
  function ({
    value = "",
    label,
    font = "normal",
    language,
    nowrap = false,
    readOnly = false,
    fitHeight = false,
    showRequired,
    showOptional,
    onChange,
    onSet,
    className,
    styles
  }: {
    value?: string,
    label?: string,
    font?: "normal" | "monospace",
    language?: string,
    nowrap?: boolean,
    readOnly?: boolean,
    fitHeight?: boolean,
    showRequired?: boolean,
    showOptional?: boolean,
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    onSet?: (value: string) => void,
    className?: string,
    styles?: StylesRecord
  }): ReactElement {

    let handleBeforeChange = useCallback(function (editor: any, data: any, value: string): void {
      onSet?.(value);
    }, [onSet]);

    let handleChange = useCallback(function (event: ChangeEvent<HTMLTextAreaElement>): void {
      let value = event.target.value;
      onChange?.(event);
      onSet?.(value);
    }, [onChange, onSet]);

    let innerProps = {value, font, language, nowrap, readOnly, fitHeight, styles, handleChange, handleBeforeChange};
    let innerNode = (language !== undefined) ? <TextAreaCodeMirror {...innerProps}/> : <TextAreaTextArea {...innerProps}/>;
    let node = (
      <label styleName="root" className={className}>
        <Label text={label} showRequired={showRequired} showOptional={showOptional}/>
        {innerNode}
      </label>
    );
    return node;

  }
);


const TextAreaCodeMirror = create(
  require("./text-area.scss"),
  function ({
    value,
    language,
    nowrap,
    readOnly,
    fitHeight,
    styles,
    handleBeforeChange
  }: {
    value: string,
    language?: string,
    nowrap: boolean,
    readOnly: boolean,
    fitHeight: boolean,
    styles?: StylesRecord,
    handleBeforeChange: (editor: any, data: any, value: string) => void
  }): ReactElement {

    let className = StyleNameUtil.create(
      styles!["textarea-code"],
      {if: fitHeight, true: styles!["fit"], false: styles!["no-fit"]}
    );
    let modeOptions = CodeMirrorUtil.getModeOptions(language!);
    let heightOptions = (fitHeight) ? {viewportMargin: 1 / 0} : {};
    let otherOptions = {readOnly, lineWrapping: !nowrap};
    let options = {...modeOptions, ...heightOptions, ...otherOptions};
    let node = (
      <CodeMirror className={className} value={value} options={options} onBeforeChange={handleBeforeChange}/>
    );
    return node;

  }
);


const TextAreaTextArea = create(
  require("./text-area.scss"),
  function ({
    value,
    font,
    nowrap,
    readOnly,
    handleChange
  }: {
    value: string,
    font: "normal" | "monospace",
    nowrap: boolean,
    readOnly: boolean,
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  }): ReactElement {

    let styleName = StyleNameUtil.create(
      "textarea",
      {if: font === "monospace", true: "monospace"},
      {if: nowrap, true: "nowrap"}
    );
    let node = (
      <textarea styleName={styleName} value={value} readOnly={readOnly} onChange={handleChange}/>
    );
    return node;

  }
);


export default TextArea;