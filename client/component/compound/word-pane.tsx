//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Link from "/client/component/atom/link";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import ExampleEditor from "/client/component/compound/example-editor";
import WordEditor from "/client/component/compound/word-editor";
import {
  style
} from "/client/component/decorator";
import {
  DetailedWord,
  EditableExample,
  EditableWord,
  EnhancedDictionary,
  Example,
  Relation,
  Word
} from "/client/skeleton/dictionary";


@style(require("./word-pane.scss"))
export default class WordPane extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showButton: false
  };
  public state: State = {
    wordEditorOpen: false,
    exampleEditorOpen: null
  };

  private renderName(): ReactNode {
    let editButtonNode = (this.props.showEditLink && !this.props.showButton) && (
      <div styleName="button">
        <Button label={this.trans("wordPane.edit")} iconLabel="&#xF044;" style="simple" hideLabel={true} onClick={() => this.setState({wordEditorOpen: true})}/>
      </div>
    );
    let submitButtonNode = (this.props.showButton) && (
      <div styleName="button">
        <Button label={this.trans("wordPane.submit")} iconLabel="&#xF00C;" style="simple" onClick={this.props.onSubmit}/>
      </div>
    );
    let pronunciationText = (() => {
      if (this.props.word.pronunciation !== undefined) {
        if (this.props.word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
          return this.props.word.pronunciation;
        } else {
          return "/" + this.props.word.pronunciation + "/";
        }
      } else {
        let akrantiain = this.props.dictionary.getAkrantiain();
        if (akrantiain !== null) {
          try {
            let pronunciation = akrantiain.convert(this.props.word.name);
            return "/" + pronunciation + "/";
          } catch (error) {
            console.error(error);
            return undefined;
          }
        } else {
          return undefined;
        }
      }
    })();
    let pronunciationNode = (pronunciationText !== undefined) && (() => {
      let pronunciationNode = <div styleName="pronunciation">{pronunciationText}</div>;
      return pronunciationNode;
    })();
    let tagNode = (this.props.word.tags.length > 0) && (() => {
      let tagBoxNodes = this.props.word.tags.map((tag, index) => {
        let tagBoxNode = (tag !== "") && <span styleName="box" key={index}>{tag}</span>;
        return tagBoxNode;
      });
      let tagNode = <div styleName="tag">{tagBoxNodes}</div>;
      return tagNode;
    })();
    let node = (
      <div styleName="name-wrapper">
        <div styleName="left">
          <div styleName="name">{this.props.word.name}</div>
          {pronunciationNode}
          {tagNode}
        </div>
        <div styleName="right">
          {editButtonNode}
          {submitButtonNode}
        </div>
      </div>
    );
    return node;
  }

  private renderEquivalents(): ReactNode {
    let innerNodes = this.props.word.equivalents.map((equivalent, index) => {
      let titleNode = (equivalent.title !== "") && <span styleName="box">{equivalent.title}</span>;
      let innerNode = (
        <span styleName="equivalent" key={index}>
          {titleNode}
          {equivalent.names.join(", ")}
          <br/>
        </span>
      );
      return innerNode;
    });
    let node = (innerNodes.length > 0) && (
      <div styleName="container">
        <p styleName="text">
          {innerNodes}
        </p>
      </div>
    );
    return node;
  }

  private renderInformations(): ReactNode {
    let nodes = this.props.word.informations.map((information, index) => {
      let textNode = (this.props.dictionary.settings.enableMarkdown) ? <Markdown source={information.text}/> : <p styleName="text">{information.text}</p>;
      let informationNode = (
        <div styleName="container" key={index}>
          <div styleName="title">{information.title}</div>
          {textNode}
        </div>
      );
      return informationNode;
    });
    return nodes;
  }

  private renderRelations(): ReactNode {
    let groupedRelations = new Map<string, Array<Relation>>();
    for (let relation of this.props.word.relations) {
      let title = relation.title;
      if (groupedRelations.get(title) === undefined) {
        groupedRelations.set(title, []);
      }
      groupedRelations.get(title)!.push(relation);
    }
    let innerNodes = Array.from(groupedRelations).map(([title, relations], index) => {
      let titleNode = (title !== "") && <span styleName="box">{title}</span>;
      let relationNodes = relations.map((relation, relationIndex) => {
        let href = "/dictionary/" + this.props.dictionary.number + "?search=" + encodeURIComponent(relation.name) + "&mode=name&type=exact&page=0";
        let relationNode = (
          <Fragment key={relationIndex}>
            {(relationIndex === 0) ? "" : ", "}
            <Link href={href} target="self">{relation.name}</Link>
          </Fragment>
        );
        return relationNode;
      });
      let innerNode = (
        <span styleName="relations" key={index}>
          <span styleName="confer"/>
          {titleNode}
          {relationNodes}
          <br/>
        </span>
      );
      return innerNode;
    });
    let node = (innerNodes.length > 0) && (
      <div styleName="container">
        <p styleName="text">
          {innerNodes}
        </p>
      </div>
    );
    return node;
  }

  private renderExamples(): ReactNode {
    let examples = ("examples" in this.props.word) ? this.props.word.examples : [];
    let innerNodes = examples.map((example, index) => {
      let editButtonNode = (this.props.showEditLink && !this.props.showButton) && (
        <div styleName="button">
          <Button label={this.trans("wordPane.edit")} iconLabel="&#xF044;" style="simple" hideLabel={true} onClick={() => this.setState({exampleEditorOpen: example})}/>
        </div>
      );
      let innerNode = (
        <li key={index}>
          <div styleName="example-content-wrapper">
            <div styleName="example-content">
              <span styleName="sentence">{example.sentence}</span>
              <span styleName="translation">{example.translation}</span>
            </div>
            {editButtonNode}
          </div>
        </li>
      );
      return innerNode;
    });
    let node = (innerNodes.length > 0) && (
      <div styleName="container">
        <div styleName="title">{this.props.dictionary.settings.exampleTitle}</div>
        <ul styleName="example">
          {innerNodes}
        </ul>
      </div>
    );
    return node;
  }

  private renderEditor(): ReactNode {
    let wordNode = (
      <WordEditor
        dictionary={this.props.dictionary}
        word={this.props.word}
        open={this.state.wordEditorOpen}
        onClose={() => this.setState({wordEditorOpen: false})}
        onEditConfirm={this.props.onEditConfirm}
        onRemoveConfirm={this.props.onRemoveConfirm}
      />
    );
    let exampleNode = (
      <ExampleEditor
        dictionary={this.props.dictionary}
        example={this.state.exampleEditorOpen}
        open={this.state.exampleEditorOpen !== null}
        onClose={() => this.setState({exampleEditorOpen: null})}
        onEditConfirm={this.props.onEditExampleConfirm}
        onRemoveConfirm={this.props.onRemoveExampleConfirm}
      />
    );
    return [wordNode, exampleNode];
  }

  public render(): ReactNode {
    let nameNode = this.renderName();
    let equivalentNode = this.renderEquivalents();
    let informationNode = (this.props.style === "normal") && this.renderInformations();
    let relationNode = (this.props.style === "normal") && this.renderRelations();
    let exampleNode = (this.props.style === "normal") && this.renderExamples();
    let editorNode = (!this.props.showButton) && this.renderEditor();
    let node = (
      <div styleName="root">
        {nameNode}
        {equivalentNode}
        {informationNode}
        {exampleNode}
        {relationNode}
        {editorNode}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: EnhancedDictionary,
  word: Word | DetailedWord,
  style: "normal" | "simple",
  showEditLink: boolean,
  showButton: boolean,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onRemoveConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onEditExampleConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onRemoveExampleConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
};
type DefaultProps = {
  style: "normal" | "simple",
  showButton: boolean
};
type State = {
  wordEditorOpen: boolean,
  exampleEditorOpen: Example | null
};