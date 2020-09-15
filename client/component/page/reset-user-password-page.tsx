//

import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import ResetUserPasswordForm from "/client/component/compound/reset-user-password-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./reset-user-password-page.scss"))
export default class ResetUserPasswordPage extends Component<Props, State> {

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
        <div styleName="description">{this.trans("resetUserPasswordPage.description")}</div>
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