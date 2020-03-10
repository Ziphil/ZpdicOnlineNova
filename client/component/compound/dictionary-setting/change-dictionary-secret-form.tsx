//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Button,
  RadioGroup
} from "/client/component/atom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./change-dictionary-secret-form.scss"))
class ChangeDictionarySecretFormBase extends ComponentBase<Props, State> {

  public state: State = {
    secret: false
  };

  public constructor(props: any) {
    super(props);
    let secret = this.props.currentSecret;
    this.state = {secret};
  }

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let number = this.props.number;
    let secret = this.state.secret;
    let response = await http.post("changeDictionarySecret", {number, secret});
    if (this.props.onSubmit) {
      this.props.onSubmit();
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
          <Button label="変更" onClick={this.click.bind(this)}/>
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

export let ChangeDictionarySecretForm = withRouter(ChangeDictionarySecretFormBase);