//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/client/skeleton/dictionary";


@style(require("./resource-pane.scss"))
export default class ResourcePane extends Component<Props, State> {

  public render(): ReactNode {
    let url = `https://zpdic-test.s3.amazonaws.com/resource/${this.props.dictionary.number}/${this.props.resource}`;
    let node = (
      <div styleName="root">
        <img styleName="image" src={url}/>
        {this.props.resource}
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  resource: string
};
type State = {
};