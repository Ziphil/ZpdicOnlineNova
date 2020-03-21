//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Link
} from "/client/component/atom";
import {
  applyStyle
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@applyStyle(require("./dictionary-header.scss"))
export class DictionaryHeader extends Component<Props, State> {

  public render(): ReactNode {
    let nameNode;
    if (this.props.dictionary) {
      let href = "/dictionary/" + this.props.dictionary.number;
      nameNode = (
        <div styleName="name">
          <Link label={this.props.dictionary.name} href={href} style="plane"/>
        </div>
      );
    }
    let node = (
      <div styleName="root">
        <div styleName="container">
          <div styleName="left">
            {nameNode}
          </div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton | null;
};
type State = {
};