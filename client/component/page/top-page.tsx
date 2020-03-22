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
  Header,
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
        <div styleName="notice">
          <p styleName="text">
            この新版 ZpDIC Online は、旧版にあった機能が全て実装され、現在はオープンベータ版として公開されています。
            不具合の修正や機能の調整が終わりしだい正式リリースとなり、それ以降、旧版にアクセスするとここへリダイレクトされるようになります。
            正式リリースは 2020 年 4 月上旬を予定しています。
          </p>
          <p styleName="text">
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