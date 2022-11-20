//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import LogoSvg from "/client/public/logo.svg";
import SymbolSvg from "/client/public/symbol.svg";


const Logo = create(
  require("./logo.scss"), "Logo",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <div styleName="root">
        <SymbolSvg styleName="symbol"/>
        <LogoSvg styleName="logo"/>
      </div>
    );
    return node;

  }
);


export default Logo;