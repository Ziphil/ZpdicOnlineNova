//

import {
  Fragment,
  MouseEvent,
  ReactElement,
  useCallback,
  useMemo,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Dropdown from "/client/component/atom/dropdown";
import DropdownItem from "/client/component/atom/dropdown-item";
import Icon from "/client/component/atom/icon";
import Link from "/client/component/atom/link";
import Markdown from "/client/component/atom/markdown";
import {
  create
} from "/client/component/create";
import {
  useExampleEditor,
  useTrans,
  useWordEditor
} from "/client/component/hook";
import {
  DetailedWord,
  EditableExample,
  EditableWord,
  EnhancedDictionary,
  Example,
  Relation,
  Word
} from "/client/skeleton/dictionary";
import {
  AwsUtil
} from "/client/util/aws";


const WordPane = create(
  require("./word-pane.scss"), "WordPane",
  function ({
    dictionary,
    word,
    style = "normal",
    showEditLink,
    showButton = false,
    showDirectionButton = false,
    onSubmit,
    onEditConfirm,
    onDiscardConfirm,
    onEditExampleConfirm,
    onDiscardExampleConfirm
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    style?: "normal" | "simple",
    showEditLink: boolean,
    showButton?: boolean,
    showDirectionButton?: boolean,
    onSubmit?: (direction: "oneway" | "mutual", event?: MouseEvent<HTMLButtonElement>) => void,
    onEditConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onEditExampleConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardExampleConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    const addWordEditor = useWordEditor();
    const addExampleEditor = useExampleEditor();

    const openWordEditor = useCallback(function (): void {
      addWordEditor({dictionary, word, onEditConfirm, onDiscardConfirm});
    }, [dictionary, word, onEditConfirm, onDiscardConfirm, addWordEditor]);

    const openExampleEditor = useCallback(function (example: Example): void {
      addExampleEditor({dictionary, example, onEditConfirm: onEditExampleConfirm, onDiscardConfirm: onDiscardExampleConfirm});
    }, [dictionary, onEditExampleConfirm, onDiscardExampleConfirm, addExampleEditor]);

    const innerProps = {dictionary, word, showEditLink, showButton, showDirectionButton};
    const nameNode = <WordPaneName {...innerProps} {...{onSubmit, openWordEditor}}/>;
    const equivalentNode = <WordPaneEquivalents {...innerProps}/>;
    const informationNode = (style === "normal") && <WordPaneInformations {...innerProps}/>;
    const relationNode = (style === "normal") && <WordPaneRelations {...innerProps}/>;
    const exampleNode = (style === "normal") && <WordPaneExamples {...innerProps} {...{openExampleEditor}}/>;
    const node = (
      <div styleName="root">
        {nameNode}
        {equivalentNode}
        {informationNode}
        {exampleNode}
        {relationNode}
      </div>
    );
    return node;

  }
);


const WordPaneName = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word,
    showEditLink,
    showButton,
    showDirectionButton,
    onSubmit,
    openWordEditor
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    showEditLink: boolean,
    showButton: boolean,
    showDirectionButton: boolean,
    onSubmit?: (direction: "oneway" | "mutual", event?: MouseEvent<HTMLButtonElement>) => void,
    openWordEditor: () => void
  }): ReactElement {

    const {trans} = useTrans("wordPane");

    const [directionReferenceElement, setDirectionReferenceElement] = useState<HTMLElement | null>(null);

    const pronunciationText = useMemo(() => {
      if (word.pronunciation !== undefined) {
        if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
          return word.pronunciation;
        } else {
          return "/" + word.pronunciation + "/";
        }
      } else {
        const akrantiain = dictionary.getAkrantiain();
        if (akrantiain !== null) {
          try {
            const pronunciation = akrantiain.convert(word.name);
            return "/" + pronunciation + "/";
          } catch (error) {
            console.error(error);
            return undefined;
          }
        } else {
          return undefined;
        }
      }
    }, [dictionary, word]);
    const node = (
      <div styleName="name-wrapper">
        <div styleName="left">
          <div styleName="name">{word.name}</div>
          {(pronunciationText !== undefined) && <div styleName="pronunciation">{pronunciationText}</div>}
          {(word.tags.length > 0) && (
            <div styleName="tag">
              {word.tags.map((tag, index) => (tag !== "") && <span styleName="box" key={index}>{tag}</span>)}
            </div>
          )}
        </div>
        <div styleName="right">
          {(showEditLink && !showButton) && (
            <div styleName="button">
              <Button label={trans("edit")} iconName="edit" variant="simple" hideLabel={true} onClick={openWordEditor}/>
            </div>
          )}
          {(showButton) && (
            <div styleName="button">
              <div styleName="dropdown-button">
                <Button
                  label={trans("submit")}
                  iconName="check"
                  position={(showDirectionButton) ? "left" : "alone"}
                  hideLabel={true}
                  onClick={(event) => onSubmit?.("oneway", event)}
                />
                {(showDirectionButton) && (
                  <>
                    <Button iconName="ellipsis-h" position="right" nativeRef={setDirectionReferenceElement}/>
                    <Dropdown
                      placement="bottom-end"
                      autoMode="focus"
                      referenceElement={directionReferenceElement}
                      autoElement={directionReferenceElement}
                      onSet={onSubmit}
                    >
                      <DropdownItem value="oneway"><WordPaneSubmitDropdownNode direction="oneway"/></DropdownItem>
                      <DropdownItem value="mutual"><WordPaneSubmitDropdownNode direction="mutual"/></DropdownItem>
                    </Dropdown>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
    return node;

  }
);


const WordPaneEquivalents = create(
  require("./word-pane.scss"),
  function ({
    word
  }: {
    word: Word | DetailedWord
  }): ReactElement | null {

    const innerNodes = word.equivalents.map((equivalent, index) => {
      const titleNode = (equivalent.title !== "") && <span styleName="box">{equivalent.title}</span>;
      const innerNode = (
        <span styleName="equivalent" key={index}>
          {titleNode}
          {equivalent.names.join(", ")}
          <br/>
        </span>
      );
      return innerNode;
    });
    const node = (innerNodes.length > 0) && (
      <div styleName="container">
        <p styleName="text">
          {innerNodes}
        </p>
      </div>
    );
    return node || null;

  }
);


const WordPaneInformations = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord
  }): ReactElement {

    const innerNodes = word.informations.map((information, index) => {
      const homePath = AwsUtil.getFileUrl(`resource/${dictionary.number}/`);
      const textNode = (dictionary.settings.enableMarkdown) ? <Markdown source={information.text} homePath={homePath}/> : <p styleName="text">{information.text}</p>;
      const informationNode = (
        <div styleName="container" key={index}>
          <div styleName="title">{information.title}</div>
          {textNode}
        </div>
      );
      return informationNode;
    });
    const node = (
      <Fragment>
        {innerNodes}
      </Fragment>
    );
    return node;

  }
);


const WordPaneRelations = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord
  }): ReactElement | null {

    const groupedRelations = useMemo(() => {
      const groupedRelations = new Map<string, Array<Relation>>();
      for (const relation of word.relations) {
        const title = relation.title;
        if (groupedRelations.get(title) === undefined) {
          groupedRelations.set(title, []);
        }
        groupedRelations.get(title)!.push(relation);
      }
      return groupedRelations;
    }, [word.relations]);
    const innerNodes = Array.from(groupedRelations).map(([title, relations], index) => {
      const titleNode = (title !== "") && <span styleName="box">{title}</span>;
      const relationNodes = relations.map((relation, relationIndex) => {
        const href = "/dictionary/" + dictionary.number + "?text=" + encodeURIComponent(relation.name) + "&mode=name&type=exact&page=0";
        const relationNode = (
          <Fragment key={relationIndex}>
            {(relationIndex === 0) ? "" : ", "}
            <Link href={href} target="self">{relation.name}</Link>
          </Fragment>
        );
        return relationNode;
      });
      const innerNode = (
        <span styleName="relations" key={index}>
          <span styleName="confer"/>
          {titleNode}
          {relationNodes}
          <br/>
        </span>
      );
      return innerNode;
    });
    const node = (innerNodes.length > 0) && (
      <div styleName="container">
        <p styleName="text">
          {innerNodes}
        </p>
      </div>
    );
    return node || null;

  }
);


const WordPaneExamples = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word,
    showEditLink,
    showButton,
    openExampleEditor
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    showEditLink: boolean,
    showButton: boolean,
    openExampleEditor: (example: Example) => void
  }): ReactElement | null {

    const {trans} = useTrans("wordPane");

    const examples = ("examples" in word) ? word.examples : [];
    const innerNodes = examples.map((example, index) => {
      const editButtonNode = (showEditLink && !showButton) && (
        <div styleName="button">
          <Button label={trans("edit")} iconName="edit" variant="simple" hideLabel={true} onClick={() => openExampleEditor(example)}/>
        </div>
      );
      const innerNode = (
        <li key={index}>
          <div styleName="example-content-wrapper">
            <div styleName="example-content">
              <span styleName="sentence">{example.sentence}</span>
              <span styleName="example-separator"/>
              <span styleName="translation">{example.translation}</span>
            </div>
            {editButtonNode}
          </div>
        </li>
      );
      return innerNode;
    });
    const node = (innerNodes.length > 0) && (
      <div styleName="container">
        <div styleName="title">{dictionary.settings.exampleTitle}</div>
        <ul styleName="example">
          {innerNodes}
        </ul>
      </div>
    );
    return node || null;

  }
);


const WordPaneSubmitDropdownNode = create(
  require("./word-pane.scss"),
  function ({
    direction
  }: {
    direction: "oneway" | "mutual"
  }): ReactElement {

    const {trans} = useTrans("wordPane");

    const node = (
      <div>
        <span styleName="dropdown-icon">
          <Icon name={(direction === "oneway") ? "arrow-right-long" : "arrow-right-arrow-left"}/>
        </span>
        {trans(`wordPane.${direction}`)}
      </div>
    );
    return node;

  }
);


export default WordPane;