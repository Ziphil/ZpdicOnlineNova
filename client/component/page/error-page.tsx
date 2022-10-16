//

import {
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import Icon from "/client/component/atom/icon";
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
    error: Error,
    resetErrorBoundary: (...args: Array<unknown>) => void
  }): ReactElement {

    const [, {trans}] = useIntl();
    const {pushPath} = usePath();

    const handleClick = useCallback(function (): void {
      pushPath("/");
    }, [pushPath]);

    const node = (
      <Page>
        <div styleName="root">
          <div styleName="icon-container"><Icon name="bomb"/></div>
          <div styleName="description">
            {trans("errorPage.description")}
          </div>
          <pre styleName="message">
            {error.stack}
          </pre>
          <div styleName="button-container">
            <Button label={trans("errorPage.back")} iconName="arrow-circle-left" onClick={handleClick}/>
          </div>
        </div>
      </Page>
    );
    return node;

  }
);


export default ErrorPage;