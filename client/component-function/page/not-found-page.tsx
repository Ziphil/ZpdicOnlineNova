//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";


const NotFoundPage = create(
  require("./not-found-page.scss"), "NotFoundPage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page>
        <div styleName="root">
          <div styleName="icon">&#xF128;</div>
          <div styleName="description">
            {trans("notFoundPage.description")}
          </div>
        </div>
      </Page>
    );
    return node;

  }
);


export default NotFoundPage;