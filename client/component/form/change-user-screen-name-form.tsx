//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./change-user-screen-name-form.scss"))
export default class ChangeUserScreenNameForm extends Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    let screenName = this.props.currentScreenName ?? "";
    this.state = {screenName};
  }

  private async handleClick(): Promise<void> {
    let screenName = this.state.screenName;
    let response = await this.requestPost("changeUserScreenName", {screenName});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userScreenNameChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label={this.trans("changeUserScreenNameForm.screenName")} value={this.state.screenName} onSet={(screenName) => this.setState({screenName})}/>
        <Button label={this.trans("changeUserScreenNameForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  currentScreenName: string | undefined,
  onSubmit?: () => void
};
type State = {
  screenName: string
};