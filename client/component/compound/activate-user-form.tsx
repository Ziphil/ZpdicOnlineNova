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


@style(require("./activate-user-form.scss"))
export default class ActivateUserForm extends Component<Props, State> {

  public state: State = {
  };

  private async issueActivateToken(): Promise<void> {
    let response = await this.request("issueUserActivateToken", {}, {useRecaptcha: true});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userActivateTokenIssued");
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <div styleName="caution">
          {this.trans("activateUserForm.caution")}
        </div>
        <div styleName="button">
          <Button label={this.trans("activateUserForm.send")} reactive={false} onClick={this.issueActivateToken.bind(this)}/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
};