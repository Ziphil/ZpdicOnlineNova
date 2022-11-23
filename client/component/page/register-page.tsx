//

import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import RegisterForm from "/client/component/compound/register-form";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";
import Page from "/client/component/page/page";


const RegisterPage = create(
  require("./register-page.scss"), "RegisterPage",
  function ({
  }: {
  }): ReactElement {

    const {trans, transNode} = useTrans("registerPage");

    const node = (
      <Page title={trans("title")}>
        <div styleName="title">{trans("title")}</div>
        <div styleName="explanation">
          <p>
            {transNode("privacy", {
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