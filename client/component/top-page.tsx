//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  LoginForm
} from "./login-form";
import {
  Logo
} from "./logo";
import {
  applyStyle
} from "./util/decorator";


@applyStyle(require("./top-page.scss"))
export class TopPage extends Component {

  public render(): ReactNode {
    return (
      <div styleName="top-page">
        <div styleName="logo-wrapper">
          <Logo/>
          <LoginForm/>
        </div>
        <div styleName="notice">
          <p>
            ZpDIC Online は、現在ベータ版として稼働しています。
            内部的な仕様変更などにより、やむを得ず保存されているデータを削除する場合がありますので、ご了承ください。
          </p>
          <p>
            意見や要望などは随時募集中です。
            「このような機能がほしい」や「こうした方が使いやすい」などの意見がありましたら、Twitter を介して @Ziphil までご連絡ください。
          </p>
        </div>
      </div>
    );
  }

}