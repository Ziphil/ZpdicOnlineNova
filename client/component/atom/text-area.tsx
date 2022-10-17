//

import {
  ChangeEvent,
  ReactElement,
  useCallback
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import Label from "/client/component/atom/label";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";
import {
  DataUtil
} from "/client/util/data";


export const TextArea = create(
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

    const handleBeforeChange = useCallback(function (editor: any, data: any, value: string): void {
      onSet?.(value);
    }, [onSet]);

    const handleChange = useCallback(function (event: ChangeEvent<HTMLTextAreaElement>): void {
      const value = event.target.value;
      onChange?.(event);
      onSet?.(value);
    }, [onChange, onSet]);

    const innerProps = {value, font, language, nowrap, readOnly, fitHeight, styles, handleChange, handleBeforeChange};
    const node = (
      <label styleName="root" className={className}>
        <Label text={label} showRequired={showRequired} showOptional={showOptional}/>
        {(language !== undefined) ? <TextAreaCodeMirror {...innerProps}/> : <TextAreaTextArea {...innerProps}/>}
      </label>
    );
    return node;

  }
);


const TextAreaCodeMirror = create(
  require("./text-area.scss"),
  function ({
    value,
    font,
    language,
    nowrap,
    readOnly,
    fitHeight,
    styles,
    handleBeforeChange
  }: {
    value: string,
    font: "normal" | "monospace",
    language?: string,
    nowrap: boolean,
    readOnly: boolean,
    fitHeight: boolean,
    styles?: StylesRecord,
    handleBeforeChange: (editor: any, data: any, value: string) => void
  }): ReactElement {

    const data = DataUtil.create({
      font,
      fitHeight: (fitHeight) ? "fit" : "no-fit"
    });
    const modeOptions = CodeMirrorUtil.getModeOptions(language!);
    const heightOptions = (fitHeight) ? {viewportMargin: 1 / 0} : {};
    const otherOptions = {readOnly, lineWrapping: !nowrap};
    const options = {...modeOptions, ...heightOptions, ...otherOptions};
    const node = (
      <div styleName="code-wrapper" {...data}>
        <CodeMirror className={styles!["code"]} value={value} options={options} onBeforeChange={handleBeforeChange}/>
      </div>
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

    const data = DataUtil.create({
      font,
      nowrap
    });
    const node = (
      <textarea styleName="textarea" value={value} readOnly={readOnly} onChange={handleChange} {...data}/>
    );
    return node;

  }
);


export default TextArea;