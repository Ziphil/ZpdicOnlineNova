//

import * as react from "react";
import {
  Component,
  FormEvent,
  ReactNode
} from "react";
import {
  Button
} from "./atom/button";
import {
  Input
} from "./atom/input";
import {
  applyStyle
} from "./util/decorator";


@applyStyle(require("./login-form.scss"))
export class LoginForm extends Component<{}, LoginFormState> {

  public state: LoginFormState = {
    username: "",
    password: ""
  };

  private submit(event: FormEvent<HTMLFormElement>): void {
    console.log("submitted: " + this.state.username + ", " + this.state.password);
    event.preventDefault();
  }

  public render(): ReactNode {
    return (
      <form styleName="login" onSubmit={this.submit.bind(this)}>
        <Input label="ユーザー名" onChange={(value) => this.setState({username: value})}/>
        <Input label="パスワード" type="password" onChange={(value) => this.setState({password: value})}/>
        <div styleName="button-group">
          <Button value="ログイン"/>
          <Button value="新規登録" color="green"/>
        </div>
      </form>
    );
  }

}


interface LoginFormState {

  username: string;
  password: string;

}