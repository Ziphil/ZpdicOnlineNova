//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";


const EmptyPage = create(
  require("./empty-page.scss"), "EmptyPage",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <div>application crashed</div>
    );
    return node;

  }
);


export default EmptyPage;