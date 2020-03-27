//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  DictionaryAggregationPane,
  LoginForm,
  Logo
} from "/client/component/compound";
import {
  applyStyle,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route
@applyStyle(require("./top-page.scss"))
export class TopPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="logo-wrapper">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form">
            <LoginForm showsRegister={true}/>
          </div>
        </div>
        <div styleName="aggregation">
          <DictionaryAggregationPane/>
        </div>
        <div styleName="information">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF005;</div>
            <div styleName="head">
              <div styleName="date">2020/03/28</div>
              <h1>ver 2.0.0 リリース</h1>
            </div>
          </div>
          <p styleName="text">
            リニューアルされた ZpDIC Online を正式リリースしました!
            旧版の機能は全て実装済みなので、インターフェースは変わりましたが、これまで通りご利用いただけます。
          </p>
          <p styleName="text">
            リニューアルに伴い、旧版はサービスを完全に停止し、旧版にアクセスすると自動的にこちらへリダイレクトされるようになりました。
            このリダイレクトは 2020 年 5 月 1 日までの一時的な機能になる予定なので、リンクを張っている場合はそれまでにリンク先の変更をお願いします。
          </p>
          <p styleName="text">
            今後は、旧版になかった新しい機能を実装していく予定です。
            意見や要望などは随時募集中です。
            「このような機能がほしい」や「こうした方が使いやすい」などの意見がありましたら、Twitter を介して <Link label="@Ziphil" href="https://twitter.com/Ziphil" target="blank"/> までご連絡ください。
          </p>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};