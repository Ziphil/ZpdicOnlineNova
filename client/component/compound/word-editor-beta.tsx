//

import cloneDeep from "lodash-es/cloneDeep";
import {
  nanoid
} from "nanoid";
import * as react from "react";
import {
  Dispatch,
  Fragment,
  MouseEvent,
  ReactElement,
  RefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState
} from "react";
import {
  useDrag,
  useDrop
} from "react-dnd";
import {
  AsyncOrSync
} from "ts-essentials";
import {
  Zatlin
} from "zatlin";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import ControlGroup from "/client/component/atom/control-group";
import Icon from "/client/component/atom/icon";
import Input from "/client/component/atom/input";
import {
  Suggest,
  SuggestionSpec
} from "/client/component/atom/input";
import Label from "/client/component/atom/label";
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
  moveAt,
  swap
} from "/client/util/misc";
import {
  StyleNameUtil
} from "/client/util/style-name";


const WordEditor = create(
  require("./word-editor-beta.scss"), "WordEditor",
  function ({
    dictionary,
    word,
    defaultName,
    defaultEquivalentName,
    onEditConfirm,
    onDiscardConfirm
  }: {
    dictionary: EnhancedDictionary,
    word: Word | null,
    defaultName?: string,
    defaultEquivalentName?: string,
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

    let editRelation = useCallback(function (relationWord: Word, direction: "oneway" | "mutual"): void {
      setTempWord((tempWord) => {
        let relationIndex = editingRelationIndexRef.current!;
        if (tempWord.relations[relationIndex] === undefined) {
          tempWord.relations[relationIndex] = {...Relation.createEmpty(), id: nanoid()};
        }
        tempWord.relations[relationIndex].id = relationWord.id;
        tempWord.relations[relationIndex].number = relationWord.number;
        tempWord.relations[relationIndex].name = relationWord.name;
        tempWord.relations[relationIndex].mutual = direction === "mutual";
        return {...tempWord};
      });
      setRelationChooserOpen(false);
    }, []);

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

    let addRelations = useCallback(async function (editedWord: Word): Promise<void> {
      let number = dictionary.number;
      let specs = tempWord.relations.filter((relation) => relation.mutual).map((relation) => {
        let inverseRelation = Relation.createEmpty();
        inverseRelation.number = editedWord.number;
        inverseRelation.name = editedWord.name;
        inverseRelation.title = relation.title;
        return {wordNumber: relation.number, relation: inverseRelation};
      });
      if (specs.length > 0) {
        await request("addRelations", {number, specs});
      }
    }, [dictionary, tempWord, request]);

    let editWord = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let word = recreateWord(tempWord);
      let response = await request("editWord", {number, word});
      if (response.status === 200 && !("error" in response.data)) {
        let editedWord = response.data;
        await addRelations(editedWord);
        addInformationPopup("wordEdited");
        await onEditConfirm?.(word, event);
      }
    }, [dictionary, tempWord, request, onEditConfirm, addInformationPopup, addRelations]);

    let discardWord = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      let number = dictionary.number;
      let wordNumber = tempWord.number;
      if (wordNumber !== undefined) {
        let response = await request("discardWord", {number, wordNumber});
        if (response.status === 200) {
          addInformationPopup("wordDiscarded");
          await onDiscardConfirm?.(event);
        }
      }
    }, [dictionary, tempWord, request, onDiscardConfirm, addInformationPopup]);

    let editorProps = {dictionary, word, tempWord, mutateWord, createSuggest, openRelationChooser, editWord, setAlertOpen, setResourceListOpen};
    let node = (
      <Fragment>
        <WordEditorEditor {...editorProps}/>
        <Overlay size="large" open={relationChooserOpen} onClose={() => setRelationChooserOpen(false)}>
          <WordSearcher dictionary={dictionary} style="simple" showButton={true} onSubmit={editRelation}/>
        </Overlay>
        <Overlay size="large" open={resourceListOpen} onClose={() => setResourceListOpen(false)}>
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
  require("./word-editor-beta.scss"),
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
      <div styleName="root">
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
            <Button label={trans("wordEditor.resource")} iconName="image" onClick={() => setResourceListOpen(true)}/>
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
  require("./word-editor-beta.scss"),
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
    let generateNode = (zatlin !== null) && (
      <div styleName="control-button">
        <Button label={trans("wordEditor.generate")} onClick={() => generateName(zatlin!)}/>
      </div>
    );
    let node = (
      <div styleName="container">
        <div styleName="head">
          {trans("wordEditor.basic")}
        </div>
        <div styleName="container-inner">
          <div styleName="container-item">
            <div styleName="form-wrapper">
              <div styleName="form">
                <label>
                  <Label text={trans("wordEditor.name")} position="left"/>
                  <div styleName="generate-wrapper">
                    <Input className={styles!["name"]} value={tempWord.name} onSet={mutateWord((tempWord, name) => tempWord.name = name)}/>
                    {generateNode}
                  </div>
                </label>
                <label>
                  <Label text={trans("wordEditor.pronunciation")} position="left"/>
                  <Input className={styles!["name"]} value={tempWord.pronunciation} onSet={mutateWord((tempWord, pronunciation) => tempWord.pronunciation = pronunciation || undefined)}/>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorTags = create(
  require("./word-editor-beta.scss"),
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

    let innerNodes = tempWord.tags.map((tag, index) => <WordEditorTag key={tag.id} {...{dictionary, tag, index, mutateWord, createSuggest, styles}}/>);
    let plusNode = (() => {
      let absentMessage = (tempWord.tags.length <= 0) ? trans("wordEditor.tagAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.tags.push({id: nanoid(), string: ""}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        <div styleName="head">
          {trans("wordEditor.tag")}
        </div>
        <div styleName="container-inner">
          {innerNodes}
          {plusNode}
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorTag = create(
  require("./word-editor-beta.scss"),
  function ({
    dictionary,
    tag,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tag: TempTag,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [rootRef, handleRef, dragging] = useDragDrop(
      `tag-${dictionary.id}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.tags, draggingIndex, hoverIndex))
    );

    let suggest = createSuggest("tag");
    let styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    let node = (
      <div styleName={styleName} ref={rootRef}>
        <div styleName="handle" ref={handleRef}>
          <div styleName="handle-icon"><Icon name="grip-vertical"/></div>
        </div>
        <div styleName="form-wrapper">
          <div styleName="form">
            <Input className={styles!["title"]} value={tag.string} suggest={suggest} onSet={mutateWord((tempWord, tag) => tempWord.tags[index].string = tag)}/>
          </div>
          <div styleName="control-button">
            <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.tags, index))}/>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorEquivalents = create(
  require("./word-editor-beta.scss"),
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

    let innerNodes = tempWord.equivalents.map((equivalent, index) => <WordEditorEquivalent key={equivalent.id} {...{dictionary, equivalent, index, mutateWord, createSuggest, styles}}/>);
    let plusNode = (() => {
      let absentMessage = (tempWord.equivalents.length <= 0) ? trans("wordEditor.equivalentAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.equivalents.push({...Equivalent.createEmpty(), id: nanoid(), string: ""}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        <div styleName="head">
          {trans("wordEditor.equivalent")}
        </div>
        <div styleName="container-inner">
          {innerNodes}
          {plusNode}
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorEquivalent = create(
  require("./word-editor-beta.scss"),
  function ({
    dictionary,
    equivalent,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    equivalent: TempEquivalent,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [rootRef, handleRef, dragging] = useDragDrop(
      `equivalent-${dictionary.id}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.equivalents, draggingIndex, hoverIndex))
    );

    let suggest = createSuggest("equivalent");
    let styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    let node = (
      <div styleName={styleName} ref={rootRef}>
        <div styleName="handle" ref={handleRef}>
          <div styleName="handle-icon"><Icon name="grip-vertical"/></div>
        </div>
        <div styleName="form-wrapper">
          <div styleName="form">
            <label>
              <Label text={trans("wordEditor.equivalentTitle")} position="left"/>
              <Input className={styles!["title"]} value={equivalent.title} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.equivalents[index].title = title)}/>
            </label>
            <label>
              <Label text={trans("wordEditor.equivalentNames")} position="left"/>
              <Input className={styles!["name"]} value={equivalent.string} onSet={mutateWord((tempWord, string) => tempWord.equivalents[index].string = string)}/>
            </label>
          </div>
          <div styleName="control-button">
            <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.equivalents, index))}/>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorInformations = create(
  require("./word-editor-beta.scss"),
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

    let innerNodes = tempWord.informations.map((information, index) => <WordEditorInformation key={information.id} {...{dictionary, information, index, mutateWord, createSuggest, styles}}/>);
    let plusNode = (() => {
      let absentMessage = (tempWord.informations.length <= 0) ? trans("wordEditor.informationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.informations.push({...Information.createEmpty(), id: nanoid()}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        <div styleName="head">
          {trans("wordEditor.information")}
        </div>
        <div styleName="container-inner">
          {innerNodes}
          {plusNode}
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorInformation = create(
  require("./word-editor-beta.scss"),
  function ({
    dictionary,
    information,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    information: TempInformation,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [rootRef, handleRef, dragging] = useDragDrop(
      `information-${dictionary.id}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.informations, draggingIndex, hoverIndex))
    );

    let language = (dictionary.settings.enableMarkdown) ? "markdown" as const : undefined;
    let suggest = createSuggest("information");
    let styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    let node = (
      <div styleName={styleName} ref={rootRef}>
        <div styleName="handle" ref={handleRef}>
          <div styleName="handle-icon"><Icon name="grip-vertical"/></div>
        </div>
        <div styleName="form-wrapper">
          <div styleName="form information">
            <label>
              <Label text={trans("wordEditor.informationTitle")} position="left"/>
              <Input className={styles!["title"]} value={information.title} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.informations[index].title = title)}/>
            </label>
            <label>
              <Label text={trans("wordEditor.informationText")} position="left"/>
              <TextArea className={styles!["text"]} value={information.text} font="monospace" language={language} onSet={mutateWord((tempWord, text) => tempWord.informations[index].text = text)}/>
            </label>
          </div>
          <div styleName="control-button">
            <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.informations, index))}/>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorVariations = create(
  require("./word-editor-beta.scss"),
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

    let innerNodes = tempWord.variations.map((variation, index) => <WordEditorVariation key={variation.id} {...{dictionary, variation, index, mutateWord, createSuggest, styles}}/>);
    let plusNode = (() => {
      let absentMessage = (tempWord.variations.length <= 0) ? trans("wordEditor.variationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.variations.push({...Variation.createEmpty(), id: nanoid()}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        <div styleName="head">
          {trans("wordEditor.variation")}
        </div>
        <div styleName="container-inner">
          {innerNodes}
          {plusNode}
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorVariation = create(
  require("./word-editor-beta.scss"),
  function ({
    dictionary,
    variation,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    variation: TempVariation,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [rootRef, handleRef, dragging] = useDragDrop(
      `variation-${dictionary.id}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.variations, draggingIndex, hoverIndex))
    );

    let suggest = createSuggest("variation");
    let styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    let node = (
      <div styleName={styleName} ref={rootRef}>
        <div styleName="handle" ref={handleRef}>
          <div styleName="handle-icon"><Icon name="grip-vertical"/></div>
        </div>
        <div styleName="form-wrapper">
          <div styleName="form">
            <label>
              <Label text={trans("wordEditor.variationTitle")} position="left"/>
              <Input className={styles!["title"]} value={variation.title} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.variations[index].title = title)}/>
            </label>
            <label>
              <Label text={trans("wordEditor.variationName")} position="left"/>
              <Input className={styles!["name"]} value={variation.name} onSet={mutateWord((tempWord, name) => tempWord.variations[index].name = name)}/>
            </label>
          </div>
          <div styleName="control-button">
            <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.variations, index))}/>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorRelations = create(
  require("./word-editor-beta.scss"),
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

    let innerNodes = tempWord.relations.map((relation, index) => <WordEditorRelation key={relation.id} {...{dictionary, relation, index, mutateWord, createSuggest, openRelationChooser, styles}}/>);
    let plusNode = (() => {
      let absentMessage = (tempWord.relations.length <= 0) ? trans("wordEditor.relationAbsent") : "";
      let plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={() => openRelationChooser(tempWord.relations.length)}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    let node = (
      <div styleName="container">
        <div styleName="head">
          {trans("wordEditor.relation")}
        </div>
        <div styleName="container-inner">
          {innerNodes}
          {plusNode}
        </div>
      </div>
    );
    return node;

  }
);


const WordEditorRelation = create(
  require("./word-editor-beta.scss"),
  function ({
    dictionary,
    relation,
    index,
    mutateWord,
    openRelationChooser,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    relation: TempRelation,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    openRelationChooser: (index: number) => void,
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [rootRef, handleRef, dragging] = useDragDrop(
      `relation-${dictionary.id}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.relations, draggingIndex, hoverIndex))
    );

    let suggest = createSuggest("relation");
    let styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    let node = (
      <div styleName={styleName} ref={rootRef}>
        <div styleName="handle" ref={handleRef}>
          <div styleName="handle-icon"><Icon name="grip-vertical"/></div>
        </div>
        <div styleName="form-wrapper">
          <div styleName="form">
            <label>
              <Label text={trans("wordEditor.relationTitle")} position="left"/>
              <Input className={styles!["title"]} value={relation.title} suggest={suggest} onSet={mutateWord((tempWord, title) => tempWord.relations[index].title = title)}/>
            </label>
            <label>
              <Label text={trans("wordEditor.relationName")} position="left"/>
              <ControlGroup className={StyleNameUtil.create(styles!["name"], styles!["relation-input"])}>
                <Input value={relation.name} readOnly={true}/>
                <Button label={trans("wordEditor.selectRelation")} onClick={() => openRelationChooser(index)}/>
              </ControlGroup>
            </label>
          </div>
          <div styleName="control-button">
            <Button iconName="minus" onClick={mutateWord((tempWord) => deleteAt(tempWord.relations, index))}/>
          </div>
        </div>
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
  let tags = tempWord.tags.map((tag) => ({id: nanoid(), string: tag}));
  let equivalents = tempWord.equivalents.map((equivalent) => ({...equivalent, id: nanoid(), string: equivalent.names.join(", ")}));
  let informations = tempWord.informations.map((information) => ({...information, id: nanoid()}));
  let variations = tempWord.variations.map((variation) => ({...variation, id: nanoid()}));
  let relations = tempWord.relations.map((relation) => ({...relation, id: nanoid()}));
  return {...tempWord, tags, equivalents, informations, variations, relations};
}

function recreateWord(tempWord: TempEditableWord): EditableWord {
  let tags = tempWord.tags.map((tag) => tag.string);
  let equivalents = tempWord.equivalents.map((equivalent) => ({...equivalent, names: equivalent.string.split(/\s*(?:,|、|・)\s*/)}));
  let word = {...tempWord, tags, equivalents};
  return word;
}

function useDragDrop(type: string, index: number, move: (draggingIndex: number, hoverIndex: number) => void): [RefObject<never>, RefObject<never>, boolean] {
  let rootRef = useRef<never>(null);
  let handleRef = useRef<never>(null);
  let [{dragging}, connectDrag, connectPreview] = useDrag({
    type,
    item: {index},
    collect: (monitor) => ({dragging: monitor.isDragging()})
  });
  let [, connectDrop] = useDrop<{index: number}, unknown, unknown>({
    accept: type,
    hover: (item) => {
      let draggingIndex = item.index;
      let hoverIndex = index;
      if (draggingIndex !== hoverIndex) {
        move(draggingIndex, hoverIndex);
        item.index = hoverIndex;
      }
    }
  });
  connectDrag(handleRef);
  connectDrop(connectPreview(rootRef));
  return [rootRef, handleRef, dragging];
}

export type TempEditableWord = Omit<EditableWord, "tags" | "equivalents" | "informations" | "variations" | "relations"> & {
  tags: Array<TempTag>,
  equivalents: Array<TempEquivalent>,
  informations: Array<TempInformation>,
  variations: Array<TempVariation>,
  relations: Array<TempRelation>
};
export type TempTag = {id: string, string: string};
export type TempEquivalent = Equivalent & {id: string, string: string};
export type TempInformation = Information & {id: string};
export type TempVariation = Variation & {id: string};
export type TempRelation = Relation & {id: string, mutual?: boolean};

export type MutateWordCallback = <T extends Array<unknown>>(setter: (tempWord: TempEditableWord, ...args: T) => void) => (...args: T) => void;

export default WordEditor;