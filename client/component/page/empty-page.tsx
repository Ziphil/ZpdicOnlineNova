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


const EmptyPage = create(
  require("./empty-page.scss"), "EmptyPage",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <Page>
        <Loading loading={true}/>
      </Page>
    );
    return node;

  }
);


export default EmptyPage;