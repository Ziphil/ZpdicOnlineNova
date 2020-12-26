//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
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
        {this.props.resource}
        <div styleName="button-wrapper">
          <div styleName="image">
            <img src={url}/>
          </div>
          <div styleName="button">
            <Button label={this.trans("resourcePane.discard")} iconLabel="&#xF2ED;" style="simple"/>
          </div>
        </div>
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