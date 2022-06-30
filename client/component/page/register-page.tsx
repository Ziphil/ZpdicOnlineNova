//

import * as react from "react";
import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import RegisterForm from "/client/component/compound/register-form";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const RegisterPage = create(
  require("./register-page.scss"), "RegisterPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans, transNode}] = useIntl();

    const node = (
      <Page title={trans("registerPage.title")}>
        <div styleName="title">{trans("registerPage.title")}</div>
        <div styleName="explanation">
          <p>
            {transNode("registerPage.privacy", {
              link: (parts) => <Link href="/document/other/privacy">{parts}</Link>
            })}
          </p>
        </div>
        <div styleName="form-container">
          <RegisterForm/>
        </div>
      </Page>
    );
    return node;

  }
);


export default RegisterPage;