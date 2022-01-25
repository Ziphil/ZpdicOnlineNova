//

import * as react from "react";
import {
  ReactElement
} from "react";
import Loading from "/client/component/compound/loading";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";
import {
  StyleNameUtil
} from "/client/util/style-name";


const EmptyPage = create(
  require("./empty-page.scss"), "EmptyPage",
  function ({
  }: {
  }): ReactElement {

    let node = (
      <Page>
        <Loading loading={true}/>
      </Page>
    );
    return node;

  }
);


export default EmptyPage;