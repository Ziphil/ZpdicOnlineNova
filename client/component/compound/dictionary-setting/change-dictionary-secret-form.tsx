//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  RadioGroup
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./change-dictionary-secret-form.scss"))
export class ChangeDictionarySecretForm extends StoreComponent<Props, State> {

  protected initialize(): void {
    let secret = this.props.currentSecret;
    this.state = {secret};
  }

  private async handleClick(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let secret = this.state.secret;
    let response = await this.requestPost("changeDictionarySecret", {number, secret});
    if (response.status === 200) {
      this.props.store!.sendInformation("dictionarySecretChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let specs = [
      {value: "public", label: "表示"},
      {value: "secret", label: "非表示"}
    ];
    let initialSecret = (this.props.currentSecret) ? "secret" : "public";
    let node = (
      <Fragment>
        <form styleName="root">
          <RadioGroup name="secret" specs={specs} initialValue={initialSecret} onSet={(value) => this.setState({secret: value === "secret"})}/>
          <Button label="変更" reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
        <p styleName="caution">
          この設定は、辞書一覧ページに表示されるかどうかのみに関わります。
          これを「非表示」にしても、辞書の閲覧は誰でも可能なままです。
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