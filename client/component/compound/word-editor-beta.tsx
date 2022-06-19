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
  SetStateAction,
  Suspense,
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
import Icon from "/client/component/atom/icon";
import Input from "/client/component/atom/input";
import {
  Suggest,
  SuggestionSpec
} from "/client/component/atom/input";
import Label from "/client/component/atom/label";
import Overlay from "/client/component/atom/overlay";
import TextArea from "/client/component/atom/text-area";
import Loading from "/client/component/compound/loading";
import ResourceList from "/client/component/compound/resource-list";
import WordSearcher from "/client/component/compound/word-searcher";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  invalidateQueries,
  useDragDrop,
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
  moveAt
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
    onDiscardConfirm,
    onCancel
  }: {
    dictionary: EnhancedDictionary,
    word: Word | null,
    defaultName?: string,
    defaultEquivalentName?: string,
    onEditConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onCancel?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    const [tempWord, setTempWord] = useState(createTempWord(word, defaultName, defaultEquivalentName));
    const [relationChooserOpen, setRelationChooserOpen] = useState(false);
    const [resourceListOpen, setResourceListOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const editingRelationIndexRef = useRef<number>();
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const mutateWord = useCallback(function <T extends Array<unknown>>(setter: (tempWord: TempEditableWord, ...args: T) => void): (...args: T) => void {
      const wrapper = function (...args: T): void {
        setTempWord((tempWord) => {
          setter(tempWord, ...args);
          return {...tempWord};
        });
      };
      return wrapper;
    }, []);

    const openRelationChooser = useCallback(function (index: number): void {
      editingRelationIndexRef.current = index;
      setRelationChooserOpen(true);
    }, []);

    const editRelation = useCallback(function (relationWord: Word, direction: "oneway" | "mutual"): void {
      setTempWord((tempWord) => {
        const relationIndex = editingRelationIndexRef.current!;
        if (tempWord.relations[relationIndex] === undefined) {
          tempWord.relations[relationIndex] = {...Relation.createEmpty(), tempId: nanoid()};
        }
        tempWord.relations[relationIndex].tempId = relationWord.id;
        tempWord.relations[relationIndex].number = relationWord.number;
        tempWord.relations[relationIndex].name = relationWord.name;
        tempWord.relations[relationIndex].mutual = direction === "mutual";
        return {...tempWord};
      });
      setRelationChooserOpen(false);
    }, []);

    const createSuggest = useCallback(function (propertyName: string): Suggest {
      const number = dictionary.number;
      const suggest = async function (pattern: string): Promise<Array<SuggestionSpec>> {
        const response = await request("suggestDictionaryTitles", {number, propertyName, pattern}, {ignoreError: true});
        if (response.status === 200 && !("error" in response.data)) {
          const titles = response.data;
          const suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        } else {
          return [];
        }
      };
      return suggest;
    }, [dictionary.number, request]);

    const addRelations = useCallback(async function (editedWord: Word): Promise<void> {
      const number = dictionary.number;
      const specs = tempWord.relations.filter((relation) => relation.mutual).map((relation) => {
        const inverseRelation = Relation.createEmpty();
        inverseRelation.number = editedWord.number;
        inverseRelation.name = editedWord.name;
        inverseRelation.title = relation.title;
        return {wordNumber: relation.number, relation: inverseRelation};
      });
      if (specs.length > 0) {
        await request("addRelations", {number, specs});
      }
    }, [dictionary, tempWord, request]);

    const editWord = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      const number = dictionary.number;
      const word = recreateWord(tempWord);
      const response = await request("editWord", {number, word});
      if (response.status === 200 && !("error" in response.data)) {
        const editedWord = response.data;
        await addRelations(editedWord);
        addInformationPopup("wordEdited");
        await onEditConfirm?.(word, event);
        await invalidateQueries("searchDictionary", (data) => data.number === number);
      }
    }, [dictionary, tempWord, request, onEditConfirm, addInformationPopup, addRelations]);

    const discardWord = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      const number = dictionary.number;
      const wordNumber = tempWord.number;
      if (wordNumber !== undefined) {
        const response = await request("discardWord", {number, wordNumber});
        if (response.status === 200) {
          addInformationPopup("wordDiscarded");
          await onDiscardConfirm?.(event);
          await invalidateQueries("searchDictionary", (data) => data.number === number);
        }
      }
    }, [dictionary, tempWord, request, onDiscardConfirm, addInformationPopup]);

    const editorProps = {dictionary, word, tempWord, mutateWord, createSuggest, openRelationChooser, onCancel, editWord, setAlertOpen, setResourceListOpen};
    const node = (
      <Fragment>
        <WordEditorRoot {...editorProps}/>
        <Overlay size="large" title={trans("wordSearcher.title")} open={relationChooserOpen} onClose={() => setRelationChooserOpen(false)}>
          <WordSearcher dictionary={dictionary} style="simple" showButton={true} showDirectionButton={true} onSubmit={editRelation}/>
        </Overlay>
        <Overlay size="large" title={trans("resourceList.title")} open={resourceListOpen} onClose={() => setResourceListOpen(false)}>
          <Suspense fallback={<Loading loading={true}/>}>
            <ResourceList dictionary={dictionary} size={10} showCode={true} showInstruction={true}/>
          </Suspense>
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


const WordEditorRoot = create(
  require("./word-editor-beta.scss"),
  function ({
    dictionary,
    word,
    tempWord,
    mutateWord,
    createSuggest,
    openRelationChooser,
    onCancel,
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
    onCancel?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    editWord: (event: MouseEvent<HTMLButtonElement>) => Promise<void>,
    setAlertOpen: Dispatch<SetStateAction<boolean>>,
    setResourceListOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    const [mainShown, setMainShown] = useState(true);
    const [, {trans}] = useIntl();

    const cancelButtonNode = (
      <Button label={trans("wordEditor.cancel")} iconName="times" onClick={onCancel}/>
    );
    const discardButtonNode = (word !== null) && (
      <Button label={trans("wordEditor.discard")} iconName="trash-alt" scheme="red" onClick={() => setAlertOpen(true)}/>
    );
    const confirmButtonNode = (
      <Button label={trans("wordEditor.confirm")} iconName="check" scheme="blue" reactive={true} onClick={editWord}/>
    );
    const mainStyleName = StyleNameUtil.create(
      "main",
      {if: mainShown, false: "hidden"}
    );
    const innerProps = {dictionary, tempWord, mutateWord, createSuggest};
    const node = (
      <div styleName="root">
        <div styleName="head-name" onClick={() => setMainShown((mainShown) => !mainShown)}>
          <span styleName="head-icon"><Icon name={(mainShown) ? "circle-chevron-down" : "circle-chevron-right"}/></span>
          {tempWord.name}
        </div>
        <div styleName={mainStyleName}>
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
              {cancelButtonNode}
              {discardButtonNode}
              {confirmButtonNode}
            </div>
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
    mutateWord: MutateWordCallback,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const generateName = useCallback(function (zatlin: Zatlin): void {
      try {
        const name = zatlin.generate();
        mutateWord((tempWord) => tempWord.name = name)();
      } catch (error) {
        console.log(error);
      }
    }, [mutateWord]);

    const zatlin = dictionary.getZatlin();
    const generateNode = (zatlin !== null) && (
      <div styleName="control-button">
        <Button label={trans("wordEditor.generate")} onClick={() => generateName(zatlin)}/>
      </div>
    );
    const node = (
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
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const innerNodes = tempWord.tags.map((tag, index) => <WordEditorTag key={tag.tempId} {...{dictionary, tempWord, tag, index, mutateWord, createSuggest, styles}}/>);
    const plusNode = (() => {
      const absentMessage = (tempWord.tags.length <= 0) ? trans("wordEditor.tagAbsent") : "";
      const plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.tags.push({tempId: nanoid(), string: ""}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    const node = (
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
    tempWord,
    tag,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    tag: TempTag,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [rootRef, handleRef, dragging] = useDragDrop(
      `tag-${dictionary.id}-${tempWord.tempId}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.tags, draggingIndex, hoverIndex))
    );

    const suggest = createSuggest("tag");
    const styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    const node = (
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
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const innerNodes = tempWord.equivalents.map((equivalent, index) => <WordEditorEquivalent key={equivalent.tempId} {...{dictionary, tempWord, equivalent, index, mutateWord, createSuggest, styles}}/>);
    const plusNode = (() => {
      const absentMessage = (tempWord.equivalents.length <= 0) ? trans("wordEditor.equivalentAbsent") : "";
      const plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.equivalents.push({...Equivalent.createEmpty(), tempId: nanoid(), string: ""}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    const node = (
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
    tempWord,
    equivalent,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    equivalent: TempEquivalent,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [rootRef, handleRef, dragging] = useDragDrop(
      `equivalent-${dictionary.id}-${tempWord.tempId}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.equivalents, draggingIndex, hoverIndex))
    );

    const suggest = createSuggest("equivalent");
    const styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    const node = (
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
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const innerNodes = tempWord.informations.map((information, index) => <WordEditorInformation key={information.tempId} {...{dictionary, tempWord, information, index, mutateWord, createSuggest, styles}}/>);
    const plusNode = (() => {
      const absentMessage = (tempWord.informations.length <= 0) ? trans("wordEditor.informationAbsent") : "";
      const plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.informations.push({...Information.createEmpty(), tempId: nanoid()}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    const node = (
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
    tempWord,
    information,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    information: TempInformation,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [rootRef, handleRef, dragging] = useDragDrop(
      `information-${dictionary.id}-${tempWord.tempId}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.informations, draggingIndex, hoverIndex))
    );

    const language = (dictionary.settings.enableMarkdown) ? "markdown" as const : undefined;
    const suggest = createSuggest("information");
    const styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    const node = (
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
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();

    const innerNodes = tempWord.variations.map((variation, index) => <WordEditorVariation key={variation.tempId} {...{dictionary, tempWord, variation, index, mutateWord, createSuggest, styles}}/>);
    const plusNode = (() => {
      const absentMessage = (tempWord.variations.length <= 0) ? trans("wordEditor.variationAbsent") : "";
      const plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={mutateWord((tempWord) => tempWord.variations.push({...Variation.createEmpty(), tempId: nanoid()}))}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    const node = (
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
    tempWord,
    variation,
    index,
    mutateWord,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    variation: TempVariation,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [rootRef, handleRef, dragging] = useDragDrop(
      `variation-${dictionary.id}-${tempWord.tempId}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.variations, draggingIndex, hoverIndex))
    );

    const suggest = createSuggest("variation");
    const styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    const node = (
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

    const [, {trans}] = useIntl();

    const innerNodes = tempWord.relations.map((relation, index) => <WordEditorRelation key={relation.tempId} {...{dictionary, tempWord, relation, index, mutateWord, createSuggest, openRelationChooser, styles}}/>);
    const plusNode = (() => {
      const absentMessage = (tempWord.relations.length <= 0) ? trans("wordEditor.relationAbsent") : "";
      const plusNode = (
        <div styleName="plus">
          <div styleName="absent">{absentMessage}</div>
          <div styleName="plus-button">
            <Button label={trans("wordEditor.add")} iconName="plus" onClick={() => openRelationChooser(tempWord.relations.length)}/>
          </div>
        </div>
      );
      return plusNode;
    })();
    const node = (
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
    tempWord,
    relation,
    index,
    mutateWord,
    openRelationChooser,
    createSuggest,
    styles
  }: {
    dictionary: EnhancedDictionary,
    tempWord: TempEditableWord,
    relation: TempRelation,
    index: number,
    mutateWord: MutateWordCallback,
    createSuggest: (propertyName: string) => Suggest,
    openRelationChooser: (index: number) => void,
    styles?: StylesRecord
  }): ReactElement {

    const [, {trans}] = useIntl();
    const [rootRef, handleRef, dragging] = useDragDrop(
      `relation-${dictionary.id}-${tempWord.tempId}`,
      index,
      mutateWord((tempWord, draggingIndex, hoverIndex) => moveAt(tempWord.relations, draggingIndex, hoverIndex))
    );

    const suggest = createSuggest("relation");
    const styleName = StyleNameUtil.create(
      "container-item",
      {if: dragging, true: "dragging"}
    );
    const node = (
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
  const tempWord = cloneDeep(word) ?? EditableWord.createEmpty();
  if (defaultName) {
    tempWord.name = defaultName;
  }
  if (defaultEquivalentName) {
    const equivalent = {title: "", names: [defaultEquivalentName]};
    tempWord.equivalents.push(equivalent);
  }
  const tempId = nanoid();
  const tags = tempWord.tags.map((tag) => ({tempId: nanoid(), string: tag}));
  const equivalents = tempWord.equivalents.map((equivalent) => ({...equivalent, tempId: nanoid(), string: equivalent.names.join(", ")}));
  const informations = tempWord.informations.map((information) => ({...information, tempId: nanoid()}));
  const variations = tempWord.variations.map((variation) => ({...variation, tempId: nanoid()}));
  const relations = tempWord.relations.map((relation) => ({...relation, tempId: nanoid()}));
  return {...tempWord, tempId, tags, equivalents, informations, variations, relations};
}

function recreateWord(tempWord: TempEditableWord): EditableWord {
  const tags = tempWord.tags.map((tag) => tag.string);
  const equivalents = tempWord.equivalents.map((equivalent) => ({...equivalent, names: equivalent.string.split(/\s*(?:,|、|・)\s*/)}));
  const word = {...tempWord, tags, equivalents};
  return word;
}

type TempEditableWord = Omit<EditableWord, "tags" | "equivalents" | "informations" | "variations" | "relations"> & {
  tempId: string,
  tags: Array<TempTag>,
  equivalents: Array<TempEquivalent>,
  informations: Array<TempInformation>,
  variations: Array<TempVariation>,
  relations: Array<TempRelation>
};
type TempTag = {tempId: string, string: string};
type TempEquivalent = Equivalent & {tempId: string, string: string};
type TempInformation = Information & {tempId: string};
type TempVariation = Variation & {tempId: string};
type TempRelation = Relation & {tempId: string, mutual?: boolean};

export type MutateWordCallback = <T extends Array<unknown>>(setter: (tempWord: TempEditableWord, ...args: T) => void) => (...args: T) => void;

export default WordEditor;