//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Alert from "/client/component/atom/alert";
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

  public state: State = {
    alertOpen: false
  };
  public static defaultProps: DefaultProps = {
    showCode: false
  };

  private async discardResource(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let number = this.props.dictionary.number;
    let name = this.props.resource;
    let response = await this.request("discardResource", {number, name});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("resourceDiscarded");
      if (this.props.onDiscardConfirm) {
        await this.props.onDiscardConfirm(event);
      }
    }
  }

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
      <Fragment>
        <div styleName="root">
          {this.props.resource}
          {codeNode}
          <div styleName="button-wrapper">
            <div styleName="image">
              <img src={url}/>
            </div>
            <div styleName="button">
              <Button label={this.trans("resourcePane.discard")} iconLabel="&#xF2ED;" style="simple" onClick={() => this.setState({alertOpen: true})}/>
            </div>
          </div>
        </div>
        <Alert
          text={this.trans("resourcePane.alert")}
          confirmLabel={this.trans("resourcePane.discard")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.discardResource.bind(this)}
        />
      </Fragment>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  resource: string,
  showCode: boolean,
  onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type DefaultProps = {
  showCode: boolean
};
type State = {
  alertOpen: boolean
};