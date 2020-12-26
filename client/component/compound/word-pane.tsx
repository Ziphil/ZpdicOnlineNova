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
import {
  AwsUtil
} from "/client/util/aws";


@style(require("./word-pane.scss"))
export default class WordPane extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showButton: false
  };
  public state: State = {
    editorOpen: false,
    editingExample: null
  };

  private renderName(): ReactNode {
    let editButtonNode = (this.props.showEditLink && !this.props.showButton) && (
      <div styleName="button">
        <Button label={this.trans("wordPane.edit")} iconLabel="&#xF044;" style="simple" hideLabel={true} onClick={() => this.setState({editorOpen: true})}/>
      </div>
    );
    let submitButtonNode = (this.props.showButton) && (
      <div styleName="button">
        <Button label={this.trans("wordPane.submit")} iconLabel="&#xF00C;" style="simple" onClick={this.props.onSubmit}/>
      </div>
    );
    let pronunciationText = this.generatePronunciation();
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

  private generatePronunciation(): string | undefined {
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
      let homePath = AwsUtil.getFileUrl(`resource/${this.props.dictionary.number}/`);
      let textNode = (this.props.dictionary.settings.enableMarkdown) ? <Markdown source={information.text} homePath={homePath}/> : <p styleName="text">{information.text}</p>;
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
          <Button label={this.trans("wordPane.edit")} iconLabel="&#xF044;" style="simple" hideLabel={true} onClick={() => this.setState({editingExample: example})}/>
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
    let node = (
      <WordEditor
        dictionary={this.props.dictionary}
        word={this.props.word}
        open={this.state.editorOpen}
        onClose={() => this.setState({editorOpen: false})}
        onEditConfirm={this.props.onEditConfirm}
        onDiscardConfirm={this.props.onDiscardConfirm}
      />
    );
    return node;
  }

  private renderExampleEditor(): ReactNode {
    let node = (
      <ExampleEditor
        dictionary={this.props.dictionary}
        example={this.state.editingExample}
        open={this.state.editingExample !== null}
        onClose={() => this.setState({editingExample: null})}
        onEditConfirm={this.props.onEditExampleConfirm}
        onDiscardConfirm={this.props.onDiscardExampleConfirm}
      />
    );
    return node;
  }

  public render(): ReactNode {
    let nameNode = this.renderName();
    let equivalentNode = this.renderEquivalents();
    let informationNode = (this.props.style === "normal") && this.renderInformations();
    let relationNode = (this.props.style === "normal") && this.renderRelations();
    let exampleNode = (this.props.style === "normal") && this.renderExamples();
    let editorNode = (!this.props.showButton && this.state.editorOpen) && this.renderEditor();
    let exampleEditorNode = (!this.props.showButton && this.state.editingExample !== null) && this.renderExampleEditor();
    let node = (
      <div styleName="root">
        {nameNode}
        {equivalentNode}
        {informationNode}
        {exampleNode}
        {relationNode}
        {editorNode}
        {exampleEditorNode}
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
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onEditExampleConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  onDiscardExampleConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
};
type DefaultProps = {
  style: "normal" | "simple",
  showButton: boolean
};
type State = {
  editorOpen: boolean,
  editingExample: Example | null
};