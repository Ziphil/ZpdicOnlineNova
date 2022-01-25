//

import * as react from "react";
import {
  ReactElement
} from "react";
import Markdown from "/client/component-function/atom/markdown";
import RegisterForm from "/client/component-function/compound/register-form";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const RegisterPage = create(
  require("./register-page.scss"), "RegisterPage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page>
        <div styleName="title">{trans("registerPage.title")}</div>
        <div styleName="explanation">
          <p>
            <Markdown source={trans("registerPage.privacy")} simple={true}/>
          </p>
        </div>
        <div styleName="form">
          <RegisterForm/>
        </div>
      </Page>
    );
    return node;

  }
);


export default RegisterPage;