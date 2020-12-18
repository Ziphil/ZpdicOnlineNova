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
export default class DiscardUserForm extends Component<Props, State> {

  public state: State = {
    alertOpen: false
  };

  private async discardUser(): Promise<void> {
    let response = await this.request("discardUser", {});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userDiscarded");
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
          <Button label={this.trans("discardUserForm.confirm")} reactive={true} style="caution" onClick={() => this.setState({alertOpen: true})}/>
        </form>
        <p styleName="caution">
          {this.trans("discardUserForm.caution")}
        </p>
        <Alert
          text={this.trans("discardUserForm.alert")}
          confirmLabel={this.trans("discardUserForm.confirm")}
          open={this.state.alertOpen}
          outsideClosable={true}
          onClose={() => this.setState({alertOpen: false})}
          onConfirm={this.discardUser.bind(this)}
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