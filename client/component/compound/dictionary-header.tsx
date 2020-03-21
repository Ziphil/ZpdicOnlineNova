//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-header.scss"))
export class DictionaryHeader extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let nameNode;
    if (this.props.dictionary) {
      let queryString = this.props.location!.search;
      let href = "/dictionary/" + this.props.dictionary.number + queryString;
      nameNode = <Link label={this.props.dictionary.name} href={href} style="plane"/>;
    }
    let node = (
      <div styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="name">
              {nameNode}
            </div>
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