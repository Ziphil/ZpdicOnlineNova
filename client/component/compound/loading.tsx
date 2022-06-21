//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode
} from "react";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";


export const Loading = create(
  require("./loading.scss"), "Loading",
  function ({
    loading,
    children
  }: {
    loading: boolean,
    children?: ReactNode
  }): ReactElement {

    if (loading) {
      const node = (
        <div styleName="root">
          <span styleName="spinner">
            <Icon name="circle-notch" spin={true}/>
          </span>
        </div>
      );
      return node;
    } else {
      const node = (
        <Fragment>
          {children}
        </Fragment>
      );
      return node;
    }

  }
);


export default Loading;