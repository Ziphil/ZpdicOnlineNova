//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  ComponentBase
} from "/client/component/component";
import {
  InformationPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./login-form.scss"))
class RegisterFormBase extends ComponentBase<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: "",
    errorType: null
  };

  private async performRegister(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let response = await http.post("registerUser", {name, email, password}, [400]);
    let body = response.data;
    if (!("error" in body)) {
      let succeed = await http.login({name, password});
      if (succeed) {
        this.props.history.replace("/dashboard");
      } else {
        this.setState({errorType: "loginFailed"});
      }
    } else {
      this.setState({errorType: body.type});
    }
  }

  public render(): ReactNode {
    let errorNode;
    let errorType = this.state.errorType;
    if (errorType) {
      let errorMessage = "予期せぬエラーです。";
      if (errorType === "invalidName") {
        errorMessage = "ユーザー名が不正です。ユーザー名は半角英数字とアンダーバーとハイフンのみで構成してください。";
      } else if (errorType === "invalidEmail") {
        errorMessage = "メールアドレスが不正です。";
      } else if (errorType === "invalidPassword") {
        errorMessage = "パスワードが不正です。パスワードは 6 文字以上 50 文字以下である必要があります。";
      } else if (errorType === "duplicateName") {
        errorMessage = "そのユーザー名はすでに存在しています。";
      } else if (errorType === "loginFailed") {
        errorMessage = "ログインに失敗しました。珍しいですね!";
      }
      errorNode = (
        <div styleName="error">
          <InformationPane texts={[errorMessage]} color="error"/>
        </div>
      );
    }
    let node = (
      <div>
        {errorNode}
        <form styleName="root">
          <Input label="ユーザー名" onSet={(value) => this.setState({name: value})}/>
          <Input label="メールアドレス" onSet={(value) => this.setState({email: value})}/>
          <Input label="パスワード" type="flexible" onSet={(value) => this.setState({password: value})}/>
          <div styleName="button-group">
            <Button label="新規登録" onClick={this.performRegister.bind(this)}/>
          </div>
        </form>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  name: string,
  email: string,
  password: string,
  errorType: string | null
};

export let RegisterForm = withRouter(RegisterFormBase);