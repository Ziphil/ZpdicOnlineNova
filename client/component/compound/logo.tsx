//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";


const Logo = create(
  require("./logo.scss"), "Logo",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <div styleName="root">
        <img styleName="logo" src="/static/logo.svg"/>
      </div>
    );
    return node;

  }
);


export default Logo;