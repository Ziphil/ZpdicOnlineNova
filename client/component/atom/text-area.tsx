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
  useRef,
  useState
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import Button from "/client/component/atom/button";
import Label from "/client/component/atom/label";
import Tooltip from "/client/component/atom/tooltip";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";
import {
  data
} from "/client/util/data";
import {
  MARKDOWN_EDITOR_ACTIONS
} from "/client/util/editor-action";


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
    className
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
    className?: string
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

    const modeOptions = CodeMirrorUtil.getModeOptions(language!);
    const heightOptions = (fitHeight) ? {viewportMargin: 1 / 0} : {};
    const otherOptions = {readOnly, lineWrapping: !nowrap};
    const options = {...modeOptions, ...heightOptions, ...otherOptions};
    const node = (
      <div styleName="code-wrapper" {...data({font, fitHeight})}>
        {(false) && <TextAreaMarkdownButtonList {...{editorRef}}/>}
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

    const node = (
      <textarea styleName="textarea" id={labelId} value={value} readOnly={readOnly} onChange={handleChange} {...data({font, nowrap})}/>
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

    const node = (
      <div styleName="button-container">
        <TextAreaMarkdownButton iconName="italic" actionName="italic" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="strikethrough" actionName="strikethrough" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="code" actionName="code" editorRef={editorRef}/>
        <div styleName="separator"/>
        <TextAreaMarkdownButton iconName="link" actionName="link" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="image" actionName="image" editorRef={editorRef}/>
        <div styleName="separator"/>
        <TextAreaMarkdownButton iconName="quote-left" actionName="blockquote" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="list-ul" actionName="unorderedList" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="list-ol" actionName="orderedList" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="table" actionName="table" editorRef={editorRef}/>
        <TextAreaMarkdownButton iconName="file-code" actionName="codeBlock" editorRef={editorRef}/>
      </div>
    );
    return node;

  }
);


const TextAreaMarkdownButton = create(
  require("./text-area.scss"),
  function ({
    editorRef,
    iconName,
    actionName
  }: {
    editorRef: RefObject<Editor | undefined>,
    iconName: string,
    actionName: keyof typeof MARKDOWN_EDITOR_ACTIONS
  }): ReactElement {

    const {trans} = useTrans("textArea");
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

    const performAction = useCallback(function (): void {
      const editor = editorRef.current;
      if (editor) {
        MARKDOWN_EDITOR_ACTIONS[actionName](editor);
        editor.focus();
      }
    }, [editorRef, actionName]);

    const node = (
      <>
        <Button iconName={iconName} variant="simple" type="button" nativeRef={setReferenceElement} onClick={performAction}/>
        <Tooltip placement="top" autoMode="hover" referenceElement={referenceElement} autoElement={referenceElement}>
          {trans(`markdown.${actionName}`)}
        </Tooltip>
      </>
    );
    return node;

  }
);


export default TextArea;