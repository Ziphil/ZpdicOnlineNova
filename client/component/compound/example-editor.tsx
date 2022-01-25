//

import cloneDeep from "lodash-es/cloneDeep";
import * as react from "react";
import {
  Dispatch,
  Fragment,
  MouseEvent,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import ControlGroup from "/client/component/atom/control-group";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import WordSearcher from "/client/component/compound/word-searcher";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest,
  useStateWithCallback
} from "/client/component/hook";
import {
  EditableExample,
  EnhancedDictionary,
  Example,
  LinkedWord,
  Word
} from "/client/skeleton/dictionary";
import {
  deleteAt,
  swap
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";


const ExampleEditor = create(
  require("./example-editor.scss"), "ExampleEditor",
  function ({
    dictionary,
    example,
    open,
    onClose,
    onEditConfirm,
    onDiscardConfirm
  }: {
    dictionary: EnhancedDictionary,
    example: Example | null,
    open: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>,
    onEditConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [tempExample, setTempExample] = useStateWithCallback(cloneDeep(example) ?? EditableExample.createEmpty());
    let [wordChooserOpen, setWordChooserOpen] = useState(false);
    let [alertOpen, setAlertOpen] = useState(false);
    let editingWordIndexRef = useRef<number>();
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let mutateExample = useCallback(function <T extends Array<unknown>>(setter: (tempExample: EditableExample, ...args: T) => void): (...args: T) => void {
      let wrapper = function (...args: T): void {
        setTempExample((tempExample) => {
          setter(tempExample, ...args);
          return {...tempExample};
        });
      };
      return wrapper;
    }, [setTempExample]);

    let openWordChooser = useCallback(function (index: number): void {
      editingWordIndexRef.current = index;
      setWordChooserOpen(true);
    }, []);

    let editWord = useCallback(function (word: Word): void {
      let wordIndex = editingWordIndexRef.current!;
      if (tempExample.words[wordIndex] === undefined) {
        tempExample.words[wordIndex] = LinkedWord.createEmpty();
      }
      tempExample.words[wordIndex].number = word.number;
      tempExample.words[wordIndex].name = word.name;
      setTempExample(tempExample);
      setWordChooserOpen(false);
    }, [tempExample, setTempExample]);

    let editExample = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let response = await request("editExample", {number, example: tempExample});
      if (response.status === 200) {
        addInformationPopup("exampleEdited");
        await onClose?.(event);
        await onEditConfirm?.(tempExample, event);
      }
    }, [dictionary, tempExample, request, onClose, onEditConfirm, addInformationPopup]);

    let discardExample = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let exampleNumber = tempExample.number;
      if (exampleNumber !== undefined) {
        let response = await request("discardExample", {number, exampleNumber});
        if (response.status === 200) {
          addInformationPopup("exampleDiscarded");
          await onClose?.(event);
          await onDiscardConfirm?.(event);
        }
      }
    }, [dictionary, tempExample, request, onClose, onDiscardConfirm, addInformationPopup]);

    let fetchWordNames = useCallback(async function (): Promise<void> {
      let number = dictionary.number;
      let wordNumbers = tempExample.words.map((word) => word.number);
      let response = await request("fetchWordNames", {number, wordNumbers}, {ignoreError: true});
      if (response.status === 200 && !("error" in response.data)) {
        let names = response.data.names;
        mutateExample((tempExample) => {
          for (let word of tempExample.words) {
            word.name = names[word.number] ?? undefined;
          }
        })();
      }
    }, [dictionary.number, tempExample, request, mutateExample]);

    useEffect(() => {
      let tempExample = cloneDeep(example) ?? EditableExample.createEmpty();
      setTempExample(tempExample, () => {
        fetchWordNames();
      });
    }, [example]);

    let page = (wordChooserOpen) ? 1 : 0;
    let editorProps = {dictionary, example, tempExample, mutateExample, openWordChooser, editExample, setAlertOpen};
    let node = (
      <Fragment>
        <Overlay size="large" title={trans("exampleEditor.title")} page={page} open={open} onClose={onClose} onBack={() => setWordChooserOpen(false)}>
          <ExampleEditorEditor {...editorProps}/>
          <WordSearcher dictionary={dictionary} style="simple" showButton={true} onSubmit={editWord}/>
        </Overlay>
        <Alert
          text={trans("exampleEditor.alert")}
          confirmLabel={trans("exampleEditor.alertConfirm")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardExample}
        />
      </Fragment>
    );
    return node;

  }
);


const ExampleEditorEditor = create(
  require("./example-editor.scss"),
  function ({
    dictionary,
    example,
    tempExample,
    mutateExample,
    openWordChooser,
    editExample,
    setAlertOpen
  }: {
    dictionary: EnhancedDictionary,
    example: Example | null,
    tempExample: EditableExample,
    mutateExample: MutateExampleCallback,
    openWordChooser: (index: number) => void,
    editExample: (event: MouseEvent<HTMLButtonElement>) => Promise<void>,
    setAlertOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    let [, {trans}] = useIntl();

    let discardButtonNode = (example !== null) && (
      <Button label={trans("exampleEditor.discard")} iconLabel="&#xF2ED;" style="caution" reactive={true} onClick={() => setAlertOpen(true)}/>
    );
    let confirmButtonNode = (
      <Button label={trans("exampleEditor.confirm")} iconLabel="&#xF00C;" style="information" reactive={true} onClick={editExample}/>
    );
    let innerProps = {dictionary, tempExample, mutateExample};
    let node = (
      <div>
        <div styleName="editor">
          <ExampleEditorSentence {...innerProps}/>
          <ExampleEditorTranslation {...innerProps}/>
          <ExampleEditorWords {...innerProps} {...{openWordChooser}}/>
        </div>
        <div styleName="confirm-button-wrapper">
          <div/>
          <div styleName="confirm-button">
            {discardButtonNode}
            {confirmButtonNode}
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const ExampleEditorSentence = create(
  require("./example-editor.scss"),
  function ({
    dictionary,
    tempExample,
    mutateExample
  }: {
    dictionary: EnhancedDictionary,
    tempExample: EditableExample,
    mutateExample: MutateExampleCallback
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <div styleName="container">
        <Input value={tempExample.sentence} label={trans("exampleEditor.sentence")} onSet={mutateExample((tempExample, sentence) => tempExample.sentence = sentence)}/>
      </div>
    );
    return node;

  }
);


const ExampleEditorTranslation = create(
  require("./example-editor.scss"),
  function ({
    dictionary,
    tempExample,
    mutateExample
  }: {
    dictionary: EnhancedDictionary,
    tempExample: EditableExample,
    mutateExample: MutateExampleCallback
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <div styleName="container">
        <Input value={tempExample.translation} label={trans("exampleEditor.translation")} onSet={mutateExample((tempExample, translation) => tempExample.translation = translation)}/>
      </div>
    );
    return node;

  }
);


const ExampleEditorWords = create(
  require("./example-editor.scss"),
  function ({
    dictionary,
    tempExample,
    mutateExample,
    openWordChooser,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempExample: EditableExample,
    mutateExample: MutateExampleCallback,
    openWordChooser: (index: number) => void,
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let innerNodes = tempExample.words.map((word, index) => {
      let nameLabel = (index === 0) ? trans("exampleEditor.wordName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <ControlGroup className={StyleNameUtil.create(styles!["name"], styles!["word-input"])}>
              <Input value={word.name ?? trans("exampleEditor.wordNameUndefined")} label={nameLabel} readOnly={true}/>
              <Button label={trans("exampleEditor.selectWord")} onClick={() => openWordChooser(index)}/>
            </ControlGroup>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconLabel="&#xF062;" disabled={index === 0} onClick={mutateExample((tempExample) => swap(tempExample.words, index, -1))}/>
              <Button iconLabel="&#xF063;" disabled={index === tempExample.words.length - 1} onClick={mutateExample((tempExample) => swap(tempExample.words, index, 1))}/>
              <Button iconLabel="&#xF068;" onClick={mutateExample((tempExample) => deleteAt(tempExample.words, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (tempExample.words.length <= 0) ? trans("exampleEditor.wordAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconLabel="&#xF067;" onClick={() => openWordChooser(tempExample.words.length)}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        {innerNodes}
        {plusNode}
      </div>
    );
    return node;

  }
);


export type MutateExampleCallback = <T extends Array<unknown>>(setter: (tempExample: EditableExample, ...args: T) => void) => (...args: T) => void;

export default ExampleEditor;