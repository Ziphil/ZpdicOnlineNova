//

import {
  ReactElement
} from "react";
import LoginForm from "/client/component/compound/login-form";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const LoginPage = create(
  require("./login-page.scss"), "LoginPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();

    const node = (
      <Page title={trans("loginPage.title")}>
        <div styleName="title">{trans("loginPage.title")}</div>
        <div styleName="form-container">
          <LoginForm showRegister={false}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default LoginPage;