//

import * as react from "react";
import {
  ReactElement
} from "react";
import Loading from "/client/component-function/compound/loading";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import Page from "/client/component-function/page/page";
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