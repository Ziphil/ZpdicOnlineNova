//

import * as react from "react";
import {
  ErrorInfo,
  ReactElement,
  useMemo
} from "react";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const ErrorPage = create(
  require("./error-page.scss"), "ErrorPage",
  function ({
    error,
    errorInfo
  }: {
    error: Error,
    errorInfo: ErrorInfo
  }): ReactElement {

    let [, {trans}] = useIntl();

    let message = useMemo(() => {
      let message = "";
      message += error.stack + "\n";
      message += errorInfo.componentStack;
      return message;
    }, [error, errorInfo]);
    let node = (
      <Page>
        <div styleName="root">
          <div styleName="icon">&#xF12A;</div>
          <div styleName="description">
            {trans("errorPage.description")}
          </div>
          <pre styleName="message">
            {message}
          </pre>
        </div>
      </Page>
    );
    return node;

  }
);


export default ErrorPage;