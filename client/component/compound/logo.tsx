//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  VERSION
} from "/client/variable";


const Logo = create(
  require("./logo.scss"), "Logo",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <div styleName="root">
        <div styleName="title">ZpDIC</div>
        <div styleName="subtitle">Online</div>
        <div styleName="version">ver {VERSION}</div>
      </div>
    );
    return node;

  }
);


export default Logo;