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

  public render(): ReactNode {
    let equivalentNodes = this.props.word.equivalents.map((equivalent) => {
      let equivalentNode = (
        <div styleName="equivalent">
          <span styleName="title">{equivalent.title}</span>
          {equivalent.names.join(", ")}
        </div>
      );
      return equivalentNode;
    });
    let informationNodes = this.props.word.informations.map((information) => {
      let informationNode = (
        <div styleName="information">
          <span styleName="title">{information.title}</span>
          {information.text}
        </div>
      );
      return informationNode;
    });
    let relationNodes = this.props.word.relations.map((relation) => {
      let relationNode = (
        <div styleName="relation">
          <span styleName="title">{relation.title}</span>
          {relation.name}
        </div>
      );
      return relationNode;
    });
    let node = (
      <div styleName="word-pane">
        <div styleName="name">{this.props.word.name}</div>
        {equivalentNodes}
        {informationNodes}
        {relationNodes}
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