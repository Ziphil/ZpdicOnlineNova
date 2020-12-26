//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Label from "/client/component/atom/label";
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

  public static defaultProps: DefaultProps = {
    showCode: false
  };

  public render(): ReactNode {
    let url = AwsUtil.getFileUrl(`resource/${this.props.dictionary.number}/${this.props.resource}`);
    let shortUrl = "~" + this.props.resource;
    let codeNode = (this.props.showCode) && (
      <div styleName="code-outer">
        <div styleName="code-wrapper">
          <pre styleName="code">![](&lt;{shortUrl}&gt;)</pre>
          <div styleName="copy-button">
            <Button label={this.trans("resourcePane.copy")} iconLabel="&#xF0C5;" style="simple" hideLabel={true}/>
          </div>
        </div>
      </div>
    );
    let node = (
      <div styleName="root">
        {this.props.resource}
        {codeNode}
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
  resource: string,
  showCode: boolean
};
type DefaultProps = {
  showCode: boolean
};
type State = {
};