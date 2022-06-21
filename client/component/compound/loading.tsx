//

import * as react from "react";
import {
  ReactElement
} from "react";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";


export const Loading = create(
  require("./loading.scss"), "Loading",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <div styleName="root">
        <span styleName="spinner">
          <Icon name="circle-notch" spin={true}/>
        </span>
      </div>
    );
    return node;

  }
);


export default Loading;