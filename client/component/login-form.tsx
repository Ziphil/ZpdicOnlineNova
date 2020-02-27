//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";
let styles = require("./top-page.scss");


@css(styles)
export class LoginForm extends Component {

  public render(): ReactNode {
    return (
      <form className="login">
        <div className="input-wrapper">
          <div className="label">ユーザー名:</div>
          <input type="text"/>
        </div>
        <div className="input-wrapper">
          <div className="label">パスワード:</div>
          <input type="password"/>
        </div>
        <input type="submit" value="ログイン"/>
      </form>
    );
  }

}