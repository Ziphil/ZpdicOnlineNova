//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Alert from "/client/component/atom/alert";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./remove-user-form.scss"))
export default class RemoveUserForm extends Component<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async removeUser(): Promise<void> {
    let response = await this.request("removeUser", {});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userRemoved");
      await this.logout();
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Fragment>
        <form styleName="root">
          <Button label={this.trans("removeUserForm.confirm")} reactive={true} style="caution" onClick={() => this.setState({alertOpen: true})}/>
        </form>
        <p styleName="caution">
          {this.trans("removeUserForm.caution")}
        </p>
        <Alert
          text={this.trans("removeUserForm.alert")}
          confirmLabel={this.trans("removeUserForm.confirm")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.removeUser.bind(this)}
        />
      </Fragment>
    );
    return node;
  }

}


type Props = {
  onSubmit?: () => void
};
type State = {
  alertOpen: boolean
};