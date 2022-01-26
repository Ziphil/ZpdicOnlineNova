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
  useRef,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import {
  Zatlin
} from "zatlin";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import ControlGroup from "/client/component/atom/control-group";
import Input from "/client/component/atom/input";
import {
  Suggest,
  SuggestionSpec
} from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import ResourceList from "/client/component/compound/resource-list";
import WordSearcher from "/client/component/compound/word-searcher";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  EditableWord,
  EnhancedDictionary,
  Equivalent,
  Information,
  Relation,
  Variation,
  Word
} from "/client/skeleton/dictionary";
import {
  deleteAt,
  swap
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";


const WordEditor = create(
  require("./word-editor.scss"), "WordEditor",
  function ({
    dictionary,
    word,
    defaultName,
    defaultEquivalentName,
    open,
    onClose,
    onEditConfirm,
    onDiscardConfirm
  }: {
    dictionary: EnhancedDictionary,
    word: Word | null,
    defaultName?: string,
    defaultEquivalentName?: string,
    open: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => AsyncOrSync<void>,
    onEditConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [tempWord, setTempWord] = useState(createTempWord(word, defaultName, defaultEquivalentName));
    let [relationChooserOpen, setRelationChooserOpen] = useState(false);
    let [resourceListOpen, setResourceListOpen] = useState(false);
    let [alertOpen, setAlertOpen] = useState(false);
    let editingRelationIndexRef = useRef<number>();
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let mutateWord = useCallback(function <T extends Array<unknown>>(setter: (tempWord: TempEditableWord, ...args: T) => void): (...args: T) => void {
      let wrapper = function (...args: T): void {
        setTempWord((tempWord) => {
          setter(tempWord, ...args);
          return {...tempWord};
        });
      };
      return wrapper;
    }, []);

    let openRelationChooser = useCallback(function (index: number): void {
      editingRelationIndexRef.current = index;
      setRelationChooserOpen(true);
    }, []);

    let editRelation = useCallback(function (relationWord: Word): void {
      let relationIndex = editingRelationIndexRef.current!;
      if (tempWord.relations[relationIndex] === undefined) {
        tempWord.relations[relationIndex] = Relation.createEmpty();
      }
      tempWord.relations[relationIndex].number = relationWord.number;
      tempWord.relations[relationIndex].name = relationWord.name;
      setTempWord(tempWord);
      setRelationChooserOpen(false);
    }, [tempWord]);

    let createSuggest = useCallback(function (propertyName: string): Suggest {
      let number = dictionary.number;
      let suggest = async function (pattern: string): Promise<Array<SuggestionSpec>> {
        let response = await request("suggestDictionaryTitles", {number, propertyName, pattern}, {ignoreError: true});
        if (response.status === 200 && !("error" in response.data)) {
          let titles = response.data;
          let suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        } else {
          return [];
        }
      };
      return suggest;
    }, [dictionary.number, request]);

    let editWord = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let equivalentStrings = tempWord.equivalentStrings;
      equivalentStrings.forEach((equivalentString, index) => {
        tempWord.equivalents[index].names = equivalentString.split(/\s*(?:,|、|・)\s*/);
      });
      let response = await request("editWord", {number, word: tempWord});
      if (response.status === 200) {
        addInformationPopup("wordEdited");
        await onClose?.(event);
        await onEditConfirm?.(tempWord, event);
      }
    }, [dictionary, tempWord, request, onClose, onEditConfirm, addInformationPopup]);

    let discardWord = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let wordNumber = tempWord.number;
      if (wordNumber !== undefined) {
        let response = await request("discardWord", {number, wordNumber});
        if (response.status === 200) {
          addInformationPopup("wordDiscarded");
          await onClose?.(event);
          await onDiscardConfirm?.(event);
        }
      }
    }, [dictionary, tempWord, request, onClose, onDiscardConfirm, addInformationPopup]);

    let handleBack = useCallback(function (): void {
      setRelationChooserOpen(false);
      setResourceListOpen(false);
    }, []);

    let page = (resourceListOpen) ? 2 : (relationChooserOpen) ? 1 : 0;
    let showBack = relationChooserOpen || resourceListOpen;
    let editorProps = {dictionary, word, tempWord, mutateWord, createSuggest, openRelationChooser, editWord, setAlertOpen, setResourceListOpen};
    let node = (
      <Fragment>
        <Overlay
          size="large"
          title={trans("wordEditor.title")}
          open={open}
          page={page}
          showBack={showBack}
          onClose={onClose}
          onBack={handleBack}
        >
          <WordEditorEditor {...editorProps}/>
          <WordSearcher dictionary={dictionary} style="simple" showButton={true} onSubmit={editRelation}/>
          <ResourceList dictionary={dictionary} size={10} showCode={true} showInstruction={true}/>
        </Overlay>
        <Alert
          text={trans("wordEditor.alert")}
          confirmLabel={trans("wordEditor.alertConfirm")}
          open={alertOpen}
          outsideClosable={true}
          onClose={() => setAlertOpen(false)}
          onConfirm={discardWord}
        />
      </Fragment>
    );
    return node;

  }
);


const WordEditorEditor = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    word,
    tempWord,
    mutateWord,
    createSuggest,
    openRelationChooser,
    editWord,
    setAlertOpen,
    setResourceListOpen
  }: {
    dictionary: EnhancedDictionary,
    word: Word | null,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    openRelationChooser: (index: number) => void,
    editWord: (event: MouseEvent<HTMLButtonElement>) => Promise<void>,
    setAlertOpen: Dispatch<SetStateAction<boolean>>,
    setResourceListOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    let [, {trans}] = useIntl();

    let discardButtonNode = (word !== null) && (
      <Button label={trans("wordEditor.discard")} iconName="trash-alt" style="caution" onClick={() => setAlertOpen(true)}/>
    );
    let confirmButtonNode = (
      <Button label={trans("wordEditor.confirm")} iconName="check" style="information" reactive={true} onClick={editWord}/>
    );
    let innerProps = {dictionary, tempWord, mutateWord, createSuggest};
    let node = (
      <div>
        <div styleName="editor">
          <WordEditorName {...innerProps}/>
          <WordEditorTags {...innerProps}/>
          <WordEditorEquivalents {...innerProps}/>
          <WordEditorInformations {...innerProps}/>
          <WordEditorVariations {...innerProps}/>
          <WordEditorRelations {...innerProps} {...{openRelationChooser}}/>
        </div>
        <div styleName="confirm-button-wrapper">
          <div styleName="confirm-button">
            <Button label={trans("wordEditor.resource")} iconName="file" onClick={() => setResourceListOpen(true)}/>
          </div>
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


const WordEditorName = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    tempWord,
    mutateWord,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let generateName = useCallback(function (zatlin: Zatlin): void {
      try {
        let name = zatlin!.generate();
        mutateWord((tempWord) => tempWord.name = name)();
      } catch (error) {
        console.log(error);
      }
    }, [mutateWord]);

    let zatlin = dictionary.getZatlin();
    let nameLabel = trans("wordEditor.name");
    let pronunciationLabel = trans("wordEditor.pronunciation");
    let generateNode = (zatlin !== null) && (
      <div styleName="control-button">
        <Button label={trans("wordEditor.generate")} onClick={() => generateName(zatlin!)}/>
      </div>
    );
    let node = (
      <div styleName="container">
        <div styleName="inner">
          <div styleName="form">
            <Input className={styles!["title"]} value={tempWord.name} label={nameLabel} onSet={mutateWord((tempWord, name) => tempWord.name = name)}/>
          </div>
          {generateNode}
        </div>
        <div styleName="inner large">
          <div styleName="form">
            <Input className={styles!["title"]} value={tempWord.pronunciation} label={pronunciationLabel} onSet={mutateWord((tempWord, pronunciation) => tempWord.pronunciation = pronunciation || undefined)}/>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorTags = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    tempWord,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let suggest = createSuggest("tag");
    let innerNodes = tempWord.tags.map((tag, index) => {
      let label = (index === 0) ? trans("wordEditor.tag") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles!["title"]} value={tag} label={label} suggest={suggest} onSet={mutateWord((tempWord, tag) => tempWord.tags[index] = tag)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconName="arrow-up" disabled={index === 0} onClick={mutateWord((tempWord) => swap(tempWord.tags, index, -1))}/>
              <Button iconName="arrow-down" disabled={index === tempWord.tags.length - 1} onClick={mutateWord((tempWord) => swap(tempWord.tags, index, 1))}/>
              <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.tags, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (tempWord.tags.length <= 0) ? trans("wordEditor.tagAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconName="plus" onClick={mutateWord((tempWord) => tempWord.tags.push(""))}/>
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


const WordEditorEquivalents = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    tempWord,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let swapEquivalent = useCallback(function (tempWord: TempEditableWord, index: number, direction: 1 | -1): void {
      let equivalentStrings = tempWord.equivalentStrings;
      swap(tempWord.equivalents, index, direction);
      swap(equivalentStrings, index, direction);
    }, []);

    let deleteEquivalent = useCallback(function (tempWord: TempEditableWord, index: number): void {
      let equivalentStrings = tempWord.equivalentStrings;
      deleteAt(tempWord.equivalents, index);
      deleteAt(equivalentStrings, index);
    }, []);

    let addEquivalent = useCallback(function (tempWord: TempEditableWord): void {
      let equivalentStrings = tempWord.equivalentStrings;
      tempWord.equivalents.push(Equivalent.createEmpty());
      equivalentStrings.push("");
    }, []);

    let equivalentStrings = tempWord.equivalentStrings;
    let suggest = createSuggest("equivalent");
    let innerNodes = tempWord.equivalents.map((equivalent, index) => {
      let titleLabel = (index === 0) ? trans("wordEditor.equivalentTitle") : undefined;
      let nameLabel = (index === 0) ? trans("wordEditor.equivalentNames") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles!["title"]} value={equivalent.title} label={titleLabel} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.equivalents[index].title = title)}/>
            <Input className={styles!["name"]} value={equivalentStrings[index]} label={nameLabel} onSet={mutateWord((tempWord, string) => tempWord.equivalentStrings[index] = string)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconName="arrow-up" disabled={index === 0} onClick={mutateWord((tempWord) => swapEquivalent(tempWord, index, -1))}/>
              <Button iconName="arrow-down" disabled={index === tempWord.equivalents.length - 1} onClick={mutateWord((tempWord) => swapEquivalent(tempWord, index, 1))}/>
              <Button iconName="minus" onClick={mutateWord((tempWord) => deleteEquivalent(tempWord, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (tempWord.equivalents.length <= 0) ? trans("wordEditor.equivalentAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconName="plus" onClick={mutateWord((tempWord) => addEquivalent(tempWord))}/>
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


const WordEditorInformations = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    tempWord,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let language = (dictionary.settings.enableMarkdown) ? "markdown" as const : undefined;
    let suggest = createSuggest("information");
    let innerNodes = tempWord.informations.map((information, index) => {
      let titleLabel = (index === 0) ? trans("wordEditor.informationTitle") : undefined;
      let textLabel = (index === 0) ? trans("wordEditor.informationText") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form information">
            <Input className={styles!["title"]} value={information.title} label={titleLabel} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.informations[index].title = title)}/>
            <TextArea className={styles!["text"]} value={information.text} label={textLabel} font="monospace" language={language} onSet={mutateWord((tempWord, text) => tempWord.informations[index].text = text)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconName="arrow-up" disabled={index === 0} onClick={mutateWord((tempWord) => swap(tempWord.informations, index, -1))}/>
              <Button iconName="arrow-down" disabled={index === tempWord.informations.length - 1} onClick={mutateWord((tempWord) => swap(tempWord.informations, index, 1))}/>
              <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.informations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (tempWord.informations.length <= 0) ? trans("wordEditor.informationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconName="plus" onClick={mutateWord((tempWord) => tempWord.informations.push(Information.createEmpty()))}/>
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


const WordEditorVariations = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    tempWord,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let suggest = createSuggest("variation");
    let innerNodes = tempWord.variations.map((variation, index) => {
      let titleLabel = (index === 0) ? trans("wordEditor.variationTitle") : undefined;
      let nameLabel = (index === 0) ? trans("wordEditor.variationName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles!["title"]} value={variation.title} label={titleLabel} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.variations[index].title = title)}/>
            <Input className={styles!["name"]} value={variation.name} label={nameLabel} onSet={mutateWord((tempWord, name) => tempWord.variations[index].name = name)}/>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconName="arrow-up" disabled={index === 0} onClick={mutateWord((tempWord) => swap(tempWord.variations, index, -1))}/>
              <Button iconName="arrow-down" disabled={index === tempWord.variations.length - 1} onClick={mutateWord((tempWord) => swap(tempWord.variations, index, 1))}/>
              <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.variations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (tempWord.variations.length <= 0) ? trans("wordEditor.variationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconName="plus" onClick={mutateWord((tempWord) => tempWord.variations.push(Variation.createEmpty()))}/>
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


const WordEditorRelations = create(
  require("./word-editor.scss"),
  function ({
    dictionary,
    tempWord,
    mutateWord,
    createSuggest,
    openRelationChooser,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    openRelationChooser: (index: number) => void,
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();

    let suggest = createSuggest("relation");
    let innerNodes = tempWord.relations.map((relation, index) => {
      let titleLabel = (index === 0) ? trans("wordEditor.relationTitle") : undefined;
      let nameLabel = (index === 0) ? trans("wordEditor.relationName") : undefined;
      let innerNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Input className={styles!["title"]} value={relation.title} label={titleLabel} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.relations[index].title = title)}/>
            <ControlGroup className={StyleNameUtil.create(styles!["name"], styles!["relation-input"])}>
              <Input value={relation.name} label={nameLabel} readOnly={true}/>
              <Button label={trans("wordEditor.selectRelation")} onClick={() => openRelationChooser(index)}/>
            </ControlGroup>
          </div>
          <div styleName="control-button">
            <ControlGroup>
              <Button iconName="arrow-up" disabled={index === 0} onClick={mutateWord((tempWord) => swap(tempWord.relations, index, -1))}/>
              <Button iconName="arrow-down" disabled={index === tempWord.relations.length - 1} onClick={mutateWord((tempWord) => swap(tempWord.relations, index, 1))}/>
              <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.relations, index))}/>
            </ControlGroup>
          </div>
        </div>
      );
      return innerNode;
    });
    let plusNode = (() => {
      let absentMessage = (tempWord.relations.length <= 0) ? trans("wordEditor.relationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button iconName="plus" onClick={() => openRelationChooser(tempWord.relations.length)}/>
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


function createTempWord(word: EditableWord | null, defaultName?: string, defaultEquivalentName?: string): TempEditableWord {
  let tempWord = cloneDeep(word) ?? EditableWord.createEmpty();
  if (defaultName) {
    tempWord.name = defaultName;
  }
  if (defaultEquivalentName) {
    let equivalent = {title: "", names: [defaultEquivalentName]};
    tempWord.equivalents.push(equivalent);
  }
  let equivalentStrings = tempWord.equivalents.map((equivalent) => equivalent.names.join(", "));
  return {...tempWord, equivalentStrings};
}

export type TempEditableWord = EditableWord & {equivalentStrings: Array<string>};
export type MutateWordCallback = <T extends Array<unknown>>(setter: (tempWord: TempEditableWord, ...args: T) => void) => (...args: T) => void;

export default WordEditor;