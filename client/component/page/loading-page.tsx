//

import * as react from "react";
import {
  ReactElement
} from "react";
import Loading from "/client/component/compound/loading";
import {
  create
} from "/client/component/create";
import Page from "/client/component/page/page";


const LoadingPage = create(
  require("./loading-page.scss"), "LoadingPage",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <Page>
        <div styleName="root">
          <Loading/>
        </div>
      </Page>
    );
    return node;

  }
);


export default LoadingPage;