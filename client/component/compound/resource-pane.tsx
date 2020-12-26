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
import {
  AwsUtil
} from "/client/util/aws";


@style(require("./resource-pane.scss"))
export default class ResourcePane extends Component<Props, State> {

  public render(): ReactNode {
    let url = AwsUtil.getFileUrl(`resource/${this.props.dictionary.number}/${this.props.resource}`);
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