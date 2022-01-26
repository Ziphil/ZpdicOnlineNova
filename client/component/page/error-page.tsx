//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePath
} from "/client/component/hook";
import Page from "/client/component/page/page";


const ErrorPage = create(
  require("./error-page.scss"), "ErrorPage",
  function ({
    error,
    resetErrorBoundary
  }: {
    error: Error;
    resetErrorBoundary: (...args: Array<unknown>) => void
  }): ReactElement {

    let [, {trans}] = useIntl();
    let {pushPath} = usePath();

    let handleClick = useCallback(function (): void {
      resetErrorBoundary();
      pushPath("/");
    }, [resetErrorBoundary, pushPath]);

    let node = (
      <Page>
        <div styleName="root">
          <div styleName="icon">&#xF12A;</div>
          <div styleName="description">
            {trans("errorPage.description")}
          </div>
          <pre styleName="message">
            {error.stack}
          </pre>
          <div styleName="button">
            <Button label={trans("errorPage.back")} iconName="arrow-circle-left" onClick={handleClick}/>
          </div>
        </div>
      </Page>
    );
    return node;

  }
);


export default ErrorPage;