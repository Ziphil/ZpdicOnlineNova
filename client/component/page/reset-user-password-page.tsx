//

import * as queryParser from "query-string";
import {
  ReactElement,
  useMemo
} from "react";
import {
  useLocation
} from "react-use";
import ResetUserPasswordForm from "/client/component/compound/reset-user-password-form";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const ResetUserPasswordPage = create(
  require("./reset-user-password-page.scss"), "ResetUserPasswordPage",
  function ({
  }: {
  }): ReactElement {

    const [, {trans}] = useIntl();
    const location = useLocation();

    const tokenKey = useMemo(() => {
      const query = queryParser.parse(location.search ?? "");
      const tokenKey = (typeof query.key === "string") ? query.key : null;
      return tokenKey;
    }, [location.search]);
    const node = (
      <Page title={trans("resetUserPasswordPage.title")}>
        <div styleName="title">{trans("resetUserPasswordPage.title")}</div>
        <div styleName="form-container">
          <ResetUserPasswordForm tokenKey={tokenKey}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default ResetUserPasswordPage;