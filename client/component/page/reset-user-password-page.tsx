//

import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  ResetUserPasswordForm
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

  public constructor(props: Props) {
    super(props);
    this.serializeQuery();
  }

  private serializeQuery(): void {
    let query = queryParser.parse(this.props.location!.search);
    let tokenKey = (typeof query.key === "string") ? query.key : null;
    this.state = {tokenKey};
  }

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">パスワードリセット</div>
        <div styleName="form">
          <ResetUserPasswordForm tokenKey={this.state.tokenKey}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  tokenKey: string | null;
};