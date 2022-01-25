//

import * as react from "react";
import {
  ReactElement
} from "react";
import LoginForm from "/client/component-function/compound/login-form";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const LoginPage = create(
  require("./login-page.scss"), "LoginPage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page>
        <div styleName="title">{trans("loginPage.title")}</div>
        <div styleName="form">
          <LoginForm showRegister={false}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default LoginPage;