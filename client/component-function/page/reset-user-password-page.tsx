//

import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactElement,
  useMemo
} from "react";
import {
  useLocation
} from "react-use";
import ResetUserPasswordForm from "/client/component-function/compound/reset-user-password-form";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const ResetUserPasswordPage = create(
  require("./reset-user-password-page.scss"), "ResetUserPasswordPage",
  function ({
  }: {
  }): ReactElement {

    let location = useLocation();
    let tokenKey = useMemo(() => {
      let query = queryParser.parse(location.search ?? "");
      let tokenKey = (typeof query.key === "string") ? query.key : null;
      return tokenKey;
    }, [location]);
    let [, {trans}] = useIntl();

    let node = (
      <Page>
        <div styleName="title">{trans("resetUserPasswordPage.title")}</div>
        <div styleName="form">
          <ResetUserPasswordForm tokenKey={tokenKey}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ResetUserPasswordPage;