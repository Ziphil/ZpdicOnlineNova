//

import {
  ReactElement
} from "react";
import LoginForm from "/client/component/compound/login-form";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";
import Page from "/client/component/page/page";


const LoginPage = create(
  require("./login-page.scss"), "LoginPage",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("loginPage");

    const node = (
      <Page title={trans("title")}>
        <div styleName="title">{trans("title")}</div>
        <div styleName="form-container">
          <LoginForm showRegister={false}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default LoginPage;