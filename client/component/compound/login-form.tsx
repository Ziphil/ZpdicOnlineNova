//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  InformationPane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  getMessage
} from "/client/component/message";


@route @inject
@applyStyle(require("./login-form.scss"))
export class LoginForm extends StoreComponent<Props, State> {

  public state: State = {
    name: "",
    password: "",
    errorType: null
  };

  private async performLogin(event: MouseEvent<HTMLElement>): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let response = await this.login({name, password}, true);
    if (response.status === 200) {
      this.replacePath("/dashboard");
    } else {
      this.setState({errorType: "loginFailed"});
    }
  }

  private async jumpRegister(event: MouseEvent<HTMLElement>): Promise<void> {
    this.pushPath("/register");
  }

  public render(): ReactNode {
    let registerNode;
    if (this.props.showsRegister) {
      registerNode = <Button label="新規登録" style="simple" onClick={this.jumpRegister.bind(this)}/>;
    }
    let errorNode;
    let errorType = this.state.errorType;
    if (errorType) {
      errorNode = (
        <div styleName="error">
          <InformationPane texts={[getMessage(errorType)]} style="error" onClose={() => this.setState({errorType: null})}/>
        </div>
      );
    }
    let node = (
      <div>
        {errorNode}
        <form styleName="root">
          <Input label="ユーザー名" value={this.state.name} onSet={(value) => this.setState({name: value})}/>
          <Input label="パスワード" type="flexible" value={this.state.password} onSet={(value) => this.setState({password: value})}/>
          <div styleName="button-group">
            <Button label="ログイン" reactive={true} onClick={this.performLogin.bind(this)}/>
            {registerNode}
          </div>
        </form>
      </div>
    );
    return node;
  }

}


type Props = {
  showsRegister: boolean
};
type State = {
  name: string,
  password: string,
  errorType: string | null
};