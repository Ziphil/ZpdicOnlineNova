//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  Alert,
  Button
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  WhitePane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";
import {
  User
} from "/server/skeleton/user";


@route @inject
@applyStyle(require("./user-pane.scss"))
export class UserPane extends StoreComponent<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async deleteAuthorizedUser(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    if (this.props.dictionary !== undefined) {
      let number = this.props.dictionary.number;
      let id = this.props.user.id;
      let response = await this.requestPost("deleteDictionaryAuthorizedUser", {number, id});
      if (response.status === 200) {
        this.props.store!.addInformationPopup("dictionaryAuthorizedUserDeleted");
        if (this.props.onSubmit) {
          await this.props.onSubmit(event);
        }
      }
    }
  }

  public render(): ReactNode {
    let alertText = `
      このユーザーの編集権限を解除します。
      本当によろしいですか?
    `;
    let node = (
      <Fragment>
        <WhitePane clickable={false}>
          <div>
            <div styleName="head">
              <div styleName="right">
                <div styleName="image"/>
              </div>
              <div styleName="left">
                <div styleName="screen-name">@{this.props.user.name}</div>
                <div styleName="name">@{this.props.user.name}</div>
              </div>
            </div>
          </div>
          <div styleName="setting">
            <Button label="解除" iconLabel="&#xF05E;" style="caution" reactive={true} onClick={() => this.setState({alertOpen: true})}/>
          </div>
        </WhitePane>
        <Alert
          text={alertText}
          iconLabel="&#xF071;"
          confirmLabel="解除"
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.deleteAuthorizedUser.bind(this)}
        />
      </Fragment>
    );
    return node;
  }

}


type Props = {
  user: User,
  dictionary?: Dictionary,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
  alertOpen: boolean
};