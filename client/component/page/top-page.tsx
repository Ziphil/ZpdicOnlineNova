//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  Header,
  InformationPane,
  LoginForm,
  Logo
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./top-page.scss"))
class TopPageBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let informationText = `
      旧 ZpDIC Online からのデータ移行が完了しました。
      旧 ZpDIC Online のユーザーがそのまま使えますので、同じユーザー名とパスワードでログインしてください。
    `;
    let node = (
      <div styleName="page">
        <Header/>
        <div styleName="logo-wrapper">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form">
            <LoginForm showsRegister={true}/>
          </div>
        </div>
        <div styleName="information">
          <InformationPane texts={[informationText]} color="information"/>
        </div>
        <div styleName="notice">
          <p styleName="text">
            現在、新 ZpDIC Online は正式リリース前の開発中の段階です。
            正式リリースまでの間に、保存されているデータの削除など、破壊的な変更が行われる可能性が大いにあります。
            お試し版としてご利用ください。
          </p>
          <p styleName="text">
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