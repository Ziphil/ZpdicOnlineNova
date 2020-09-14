//

import * as react from "react";
import {
  Fragment,
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
  applyStyle,
  inject,
  intl,
  route
} from "/client/component/decorator";


@route @inject @intl
@applyStyle(require("./delete-user-form.scss"))
export class DeleteUserForm extends StoreComponent<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async deleteUser(): Promise<void> {
    let response = await this.requestPost("deleteUser", {});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userDeleted");
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
          <Button label={this.trans("deleteUserForm.confirm")} reactive={true} style="caution" onClick={() => this.setState({alertOpen: true})}/>
        </form>
        <p styleName="caution">
          {this.trans("deleteUserForm.caution")}
        </p>
        <Alert
          text={this.trans("deleteUserForm.alert")}
          iconLabel="&#xF071;"
          confirmLabel={this.trans("deleteUserForm.confirm")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.deleteUser.bind(this)}
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