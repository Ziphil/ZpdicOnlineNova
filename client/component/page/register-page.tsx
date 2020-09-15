//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import RegisterForm from "/client/component/compound/register-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./register-page.scss"))
export default class RegisterPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">{this.trans("registerPage.desciption")}</div>
        <div styleName="form">
          <RegisterForm/>
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