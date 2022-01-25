//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode
} from "react";
import {
  create
} from "/client/component/create";


const Loading = create(
  require("./loading.scss"), "Loading",
  function ({
    loading,
    children
  }: {
    loading: boolean,
    children?: ReactNode
  }): ReactElement {

    if (loading) {
      let node = (
        <div styleName="root">
          <span styleName="spinner"/>
        </div>
      );
      return node;
    } else {
      let node = (
        <Fragment>
          {children}
        </Fragment>
      );
      return node;
    }

  }
);


export default Loading;