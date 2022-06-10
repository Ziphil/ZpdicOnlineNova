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

    let node = (
      <Page>
        <div styleName="root">
          <Loading loading={true}/>
          Global loading
        </div>
      </Page>
    );
    return node;

  }
);


export default LoadingPage;