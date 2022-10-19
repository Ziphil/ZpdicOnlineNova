//

import {
  Editor
} from "codemirror";
import {
  ChangeEvent,
  ReactElement,
  RefObject,
  useCallback,
  useId,
  useRef
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import Button from "/client/component/atom/button";
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
    showButtons = false,
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
    showButtons?: boolean,
    showRequired?: boolean,
    showOptional?: boolean,
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    onSet?: (value: string) => void,
    className?: string,
    styles?: StylesRecord
  }): ReactElement {

    const labelId = useId();

    const handleBeforeChange = useCallback(function (editor: any, data: any, value: string): void {
      onSet?.(value);
    }, [onSet]);

    const handleChange = useCallback(function (event: ChangeEvent<HTMLTextAreaElement>): void {
      const value = event.target.value;
      onChange?.(event);
      onSet?.(value);
    }, [onChange, onSet]);

    const innerProps = {value, font, language, nowrap, readOnly, fitHeight, showButtons, labelId, handleChange, handleBeforeChange};
    const node = (
      <label styleName="root" className={className} htmlFor={labelId}>
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
    showButtons,
    labelId,
    styles,
    handleBeforeChange
  }: {
    value: string,
    font: "normal" | "monospace",
    language?: string,
    nowrap: boolean,
    readOnly: boolean,
    fitHeight: boolean,
    showButtons: boolean,
    labelId: string,
    styles?: StylesRecord,
    handleBeforeChange: (editor: any, data: any, value: string) => void
  }): ReactElement {

    const editorRef = useRef<Editor>();

    const handleEditorMount = useCallback(function (editor: Editor): void {
      const textAreaElement = editor.getWrapperElement().querySelector("textarea");
      if (textAreaElement !== null) {
        textAreaElement.id = labelId;
      }
      editorRef.current = editor;
    }, [labelId]);

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
        {(showButtons && language === "markdown") && <TextAreaMarkdownButtonList {...{editorRef}}/>}
        <CodeMirror className={styles!["code"]} value={value} options={options} onBeforeChange={handleBeforeChange} editorDidMount={handleEditorMount}/>
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
    labelId,
    handleChange
  }: {
    value: string,
    font: "normal" | "monospace",
    nowrap: boolean,
    readOnly: boolean,
    labelId: string,
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  }): ReactElement {

    const data = DataUtil.create({
      font,
      nowrap
    });
    const node = (
      <textarea styleName="textarea" id={labelId} value={value} readOnly={readOnly} onChange={handleChange} {...data}/>
    );
    return node;

  }
);


const TextAreaMarkdownButtonList = create(
  require("./text-area.scss"),
  function ({
    editorRef
  }: {
    editorRef: RefObject<Editor | undefined>
  }): ReactElement {

    const performAction = useCallback(function (action: string): void {
      const editor = editorRef.current;
      if (editor) {
        const actions = {
          italic: insertItalic,
          strikethrough: insertStrikethrough,
          code: insertCode,
          unorderedList: insertUnorderedList,
          orderedList: insertOrderedList,
          blockquote: insertBlockquote
        } as EditorActions;
        editor.focus();
        actions[action]?.(editor);
      }
    }, [editorRef]);

    const node = (
      <div styleName="button-container">
        <Button iconName="italic" variant="simple" type="button" onClick={() => performAction("italic")}/>
        <Button iconName="strikethrough" variant="simple" type="button" onClick={() => performAction("strikethrough")}/>
        <Button iconName="code" variant="simple" type="button" onClick={() => performAction("code")}/>
        <div styleName="separator"/>
        <Button iconName="link" variant="simple" type="button" onClick={() => performAction("link")}/>
        <Button iconName="image" variant="simple" type="button" onClick={() => performAction("image")}/>
        <div styleName="separator"/>
        <Button iconName="quote-left" variant="simple" type="button" onClick={() => performAction("blockquote")}/>
        <Button iconName="list-ul" variant="simple" type="button" onClick={() => performAction("unorderedList")}/>
        <Button iconName="list-ol" variant="simple" type="button" onClick={() => performAction("orderedList")}/>
        <Button iconName="table" variant="simple" type="button" onClick={() => performAction("table")}/>
        <Button iconName="file-code" variant="simple" type="button" onClick={() => performAction("codeBlock")}/>
      </div>
    );
    return node;

  }
);


function insertItalic(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("*", {line: from.line, ch: from.ch});
  doc.replaceRange("*", {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch});
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + 1}, {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch}), 0);
}

function insertStrikethrough(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("~~", {line: from.line, ch: from.ch});
  doc.replaceRange("~~", {line: to.line, ch: (from.line === to.line) ? to.ch + 2 : to.ch});
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + 2}, {line: to.line, ch: (from.line === to.line) ? to.ch + 2 : to.ch}), 0);
}

function insertCode(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor("from");
  const to = doc.getCursor("to");
  doc.replaceRange("`", {line: from.line, ch: from.ch});
  doc.replaceRange("`", {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch});
  setTimeout(() => doc.setSelection({line: from.line, ch: from.ch + 1}, {line: to.line, ch: (from.line === to.line) ? to.ch + 1 : to.ch}), 0);
}

function insertUnorderedList(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("- ", {line: from.line, ch: 0});
}

function insertOrderedList(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("1. ", {line: from.line, ch: 0});
}

function insertBlockquote(editor: Editor): void {
  const doc = editor.getDoc();
  const from = doc.getCursor();
  doc.replaceRange("> ", {line: from.line, ch: 0});
}

type EditorActions = Partial<Record<string, (editor: Editor) => void>>;

export default TextArea;