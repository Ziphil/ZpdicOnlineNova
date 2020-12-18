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
import Component from "/client/component/component";
import WhitePane from "/client/component/compound/white-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  User
} from "/client/skeleton/user";


@style(require("./user-pane.scss"))
export default class UserPane extends Component<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async discardAuthorizedUser(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    if (this.props.dictionary !== undefined) {
      let number = this.props.dictionary.number;
      let id = this.props.user.id;
      let response = await this.request("discardDictionaryAuthorizedUser", {number, id});
      if (response.status === 200) {
        this.props.store!.addInformationPopup("dictionaryAuthorizedUserDiscarded");
        if (this.props.onSubmit) {
          await this.props.onSubmit(event);
        }
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Fragment>
        <WhitePane clickable={false}>
          <div>
            <div styleName="head">
              <div styleName="right">
                <div styleName="image"/>
              </div>
              <div styleName="left">
                <div styleName="screen-name">{this.props.user.screenName}</div>
                <div styleName="name">@{this.props.user.name}</div>
              </div>
            </div>
          </div>
          <div styleName="setting">
            <Button label={this.trans("userPane.discard")} iconLabel="&#xF05E;" style="caution" reactive={true} onClick={() => this.setState({alertOpen: true})}/>
          </div>
        </WhitePane>
        <Alert
          text={this.trans("userPane.alert")}
          confirmLabel={this.trans("userPane.discard")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.discardAuthorizedUser.bind(this)}
        />
      </Fragment>
    );
    return node;
  }

}


type Props = {
  user: User,
  dictionary?: Dictionary,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
  alertOpen: boolean
};