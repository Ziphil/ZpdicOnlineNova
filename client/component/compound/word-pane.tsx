//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import {
  SlimeWordDocument
} from "/server/model/dictionary/slime";


@applyStyle(require("./word-pane.scss"))
class WordPaneBase extends ComponentBase<Props, State> {

  private renderEquivalentNode(): ReactNode {
    let innerNodes = this.props.word.equivalents.map((equivalent) => {
      let innerNode = (
        <p>
          <span styleName="box">{equivalent.title}</span>
          {equivalent.names.join(", ")}
        </p>
      );
      return innerNode;
    });
    let node = (
      <div styleName="container">
        {innerNodes}
      </div>
    );
    return node;
  }

  private renderInformationNode(): ReactNode {
    let nodes = this.props.word.informations.map((information) => {
      let informationNode = (
        <div styleName="container">
          <p>
            <div styleName="title">{information.title}</div>
            {information.text}
          </p>
        </div>
      );
      return informationNode;
    });
    return nodes;
  }

  private renderRationNode(): ReactNode {
    let groupedRelations = {} as {[title: string]: Array<string>};
    for (let relation of this.props.word.relations) {
      let title = relation.title;
      if (groupedRelations[title] === undefined) {
        groupedRelations[title] = [];
      }
      groupedRelations[title].push(relation.name);
    }
    let innerNodes = Object.keys(groupedRelations).map((title) => {
      let innerNode = (
        <p>
          <span styleName="box">{title}</span>
          {groupedRelations[title].join(", ")}
        </p>
      );
      return innerNode;
    });
    let node = (
      <div styleName="container">
        {innerNodes}
      </div>
    );
    return node;
  }

  public render(): ReactNode {
    let equivalentNode = this.renderEquivalentNode();
    let informationNode = this.renderInformationNode();
    let relationNode = this.renderRationNode();
    let node = (
      <div styleName="word-pane">
        <div styleName="name">{this.props.word.name}</div>
        {equivalentNode}
        {informationNode}
        {relationNode}
      </div>
    );
    return node;
  }

}


type Props = {
  word: SlimeWordDocument
};
type State = {
};

export let WordPane = withRouter(WordPaneBase);