//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  Link
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton,
  SlimeRelationSkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./word-pane.scss"))
export class WordPane extends Component<Props, State> {

  private renderNameNode(): ReactNode {
    let tagNodes = this.props.word.tags.map((tag, index) => {
      let tagNode = (tag !== "") ? <span styleName="box" key={index}>{tag}</span> : undefined;
      return tagNode;
    });
    let node = (
      <div styleName="name-wrapper">
        <div styleName="name">{this.props.word.name}</div>
        <div styleName="tag">{tagNodes}</div>
      </div>
    );
    return node;
  }

  private renderEquivalentNode(): ReactNode {
    let innerNodes = this.props.word.equivalents.map((equivalent, index) => {
      let titleNode = (equivalent.title !== "") ? <span styleName="box">{equivalent.title}</span> : undefined;
      let innerNode = (
        <p styleName="text" key={index}>
          {titleNode}
          {equivalent.names.join(", ")}
        </p>
      );
      return innerNode;
    });
    let node;
    if (innerNodes.length > 0) {
      node = (
        <div styleName="container">
          {innerNodes}
        </div>
      );
    }
    return node;
  }

  private renderInformationNode(): ReactNode {
    let nodes = this.props.word.informations.map((information, index) => {
      let informationNode = (
        <div styleName="container" key={index}>
          <p styleName="text">
            <span styleName="title">{information.title}</span>
            {information.text}
          </p>
        </div>
      );
      return informationNode;
    });
    return nodes;
  }

  private renderRelationNode(): ReactNode {
    let groupedRelations = {} as {[title: string]: Array<SlimeRelationSkeleton>};
    for (let relation of this.props.word.relations) {
      let title = relation.title;
      if (groupedRelations[title] === undefined) {
        groupedRelations[title] = [];
      }
      groupedRelations[title].push(relation);
    }
    let innerNodes = Object.keys(groupedRelations).map((title, index) => {
      let titleNode = (title !== "") ? <span styleName="box">{title}</span> : undefined;
      let relationNodes = groupedRelations[title].map((relation, relationIndex) => {
        let href = "/dictionary/" + this.props.dictionary.number + "?search=" + encodeURIComponent(relation.name) + "&mode=name&type=exact&page=0";
        let relationNode = (
          <Fragment>
            {(relationIndex === 0) ? "" : ", "}
            <Link href={href}>{relation.name}</Link>
          </Fragment>
        );
        return relationNode;
      });
      let innerNode = (
        <p styleName="text" key={index}>
          <span styleName="confer">&#xF0A4;</span>
          {titleNode}
          {relationNodes}
        </p>
      );
      return innerNode;
    });
    let node;
    if (innerNodes.length > 0) {
      node = (
        <div styleName="container">
          {innerNodes}
        </div>
      );
    }
    return node;
  }

  public render(): ReactNode {
    let nameNode = this.renderNameNode();
    let equivalentNode = this.renderEquivalentNode();
    let informationNode = this.renderInformationNode();
    let relationNode = this.renderRelationNode();
    let node = (
      <div styleName="root">
        {nameNode}
        {equivalentNode}
        {informationNode}
        {relationNode}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton,
  word: SlimeWordSkeleton
};
type State = {
};