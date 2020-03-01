//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  applyStyle
} from "../../util/decorator";
import {
  ComponentBase
} from "../component";
import {
  Header,
  LoginForm,
  Logo
} from "../compound";


@applyStyle(require("./top-page.scss"))
class TopPageBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="top-page">
        <Header/>
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
    return node;
  }

}


type Props = {
};
type State = {
};

export let TopPage = withRouter(TopPageBase);