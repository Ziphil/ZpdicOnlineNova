//

import * as react from "react";
import {
  ReactElement
} from "react";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const NotFoundPage = create(
  require("./not-found-page.scss"), "NotFoundPage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page>
        <div styleName="root">
          <div styleName="icon"><Icon name="ghost"/></div>
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