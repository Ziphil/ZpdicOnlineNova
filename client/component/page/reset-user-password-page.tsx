//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  IssueUserResetTokenForm
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route @inject
@applyStyle(require("./reset-user-password-page.scss"))
export class ResetUserPasswordPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">パスワードリセット</div>
        <div styleName="form">
          <IssueUserResetTokenForm/>
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