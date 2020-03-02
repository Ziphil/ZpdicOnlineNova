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
  UserRegisterBody
} from "/client/type/user";
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
    passwordRepeat: "",
    error: null
  };

  private async performRegister(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let passwordRepeat = this.state.passwordRepeat;
    if (password === passwordRepeat) {
      let response = await http.post<UserRegisterBody>("/api/user/register", {name, email, password}, [400]);
      let data = response.data;
      if (!("error" in data)) {
        let succeed = await http.login(name, password);
        if (succeed) {
          this.props.history.replace("/dashboard");
        } else {
          this.setState({error: "loginFailed"});
        }
      } else {
        this.setState({error: data.error});
      }
    } else {
      this.setState({error: "passwordMismatched"});
    }
  }

  public render(): ReactNode {
    let errorNode;
    let error = this.state.error;
    if (error) {
      let errorMessage = "予期せぬエラーです。";
      if (error === "passwordMismatched") {
        errorMessage = "確認用のパスワードが一致しません。";
      } else if (error === "invalidName") {
        errorMessage = "ユーザー名が不正です。ユーザー名は半角英数字とアンダーバーとハイフンのみで構成してください。";
      } else if (error === "duplicatedName") {
        errorMessage = "そのユーザー名はすでに存在しています。";
      } else if (error === "loginFailed") {
        errorMessage = "ログインに失敗しました。珍しいですね!";
      }
      errorNode = (
        <ul styleName="error">
          <li>{errorMessage}</li>
        </ul>
      );
    }
    let node = (
      <div>
        {errorNode}
        <form styleName="login">
          <Input label="ユーザー名" onChange={(value) => this.setState({name: value})}/>
          <Input label="メールアドレス" onChange={(value) => this.setState({email: value})}/>
          <Input label="パスワード" type="password" onChange={(value) => this.setState({password: value})}/>
          <Input label="パスワード (確認)" type="password" onChange={(value) => this.setState({passwordRepeat: value})}/>
          <div styleName="button-group">
            <Button value="新規登録" onClick={this.performRegister.bind(this)}/>
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
  passwordRepeat: string,
  error: string | null
};

export let RegisterForm = withRouter(RegisterFormBase);