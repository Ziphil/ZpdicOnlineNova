//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import RadioGroup from "/client/component/atom/radio-group";
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
@applyStyle(require("./change-dictionary-secret-form.scss"))
export default class ChangeDictionarySecretForm extends StoreComponent<Props, State> {

  public constructor(props: any) {
    super(props);
    let secret = this.props.currentSecret;
    this.state = {secret};
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let secret = this.state.secret;
    let response = await this.requestPost("changeDictionarySecret", {number, secret});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("dictionarySecretChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let specs = [
      {value: "public", label: this.trans("changeDictionarySecretForm.public")},
      {value: "secret", label: this.trans("changeDictionarySecretForm.secret")}
    ];
    let secretValue = (this.state.secret) ? "secret" : "public";
    let node = (
      <Fragment>
        <form styleName="root">
          <RadioGroup name="secret" specs={specs} value={secretValue} onSet={(value) => this.setState({secret: value === "secret"})}/>
          <Button label={this.trans("changeDictionarySecretForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
        <p styleName="caution">
          {this.trans("changeDictionarySecretForm.caution")}
        </p>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  currentSecret: boolean,
  onSubmit?: () => void
};
type State = {
  secret: boolean;
};