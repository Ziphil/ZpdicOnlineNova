//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Link
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  WordEditor
} from "/client/component/compound";
import {
  applyStyle,
  intl
} from "/client/component/decorator";
import {
  Dictionary,
  EditWord,
  Relation,
  Word
} from "/server/skeleton/dictionary";


@intl
@applyStyle(require("./word-pane.scss"))
export class WordPane extends Component<Props, State> {

  public static defaultProps: any = {
    style: "normal",
    showButton: false
  };
  public state: State = {
    editorOpen: false
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
    let tagNodes = this.props.word.tags.map((tag, index) => {
      let tagNode = (tag !== "") && <span styleName="box" key={index}>{tag}</span>;
      return tagNode;
    });
    let node = (
      <div styleName="name-wrapper">
        <div styleName="left">
          <div styleName="name">{this.props.word.name}</div>
          <div styleName="tag">{tagNodes}</div>
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
      let informationNode = (
        <div styleName="container" key={index}>
          <div styleName="title">{information.title}</div>
          <p styleName="text">
            {information.text}
          </p>
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
            <Link href={href}>{relation.name}</Link>
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

  private renderEditor(): ReactNode {
    let node = (
      <WordEditor
        dictionary={this.props.dictionary}
        word={this.props.word}
        open={this.state.editorOpen}
        onClose={() => this.setState({editorOpen: false})}
        onEditConfirm={this.props.onEditConfirm}
        onDeleteConfirm={this.props.onDeleteConfirm}
      />
    );
    return node;
  }

  public render(): ReactNode {
    let nameNode = this.renderName();
    let equivalentNode = this.renderEquivalents();
    let informationNode = (this.props.style === "normal") && this.renderInformations();
    let relationNode = (this.props.style === "normal") && this.renderRelations();
    let editorNode = (!this.props.showButton && this.state.editorOpen) && this.renderEditor();
    let node = (
      <div styleName="root">
        {nameNode}
        {equivalentNode}
        {informationNode}
        {relationNode}
        {editorNode}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  word: Word,
  style: "normal" | "simple",
  showEditLink: boolean,
  showButton: boolean,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void,
  onEditConfirm?: (word: EditWord, event: MouseEvent<HTMLButtonElement>) => void | Promise<void>,
  onDeleteConfirm?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
  editorOpen: boolean
};