//

import {ReactElement, Ref} from "react";
import {AdditionalProps, aria} from "zographia";
import {createWithRef} from "/client/component/create";
import LogotypeSvg from "/client/public/logo.svg";
import SymbolSvg from "/client/public/symbol.svg";


export const Logo = createWithRef(
  require("./logo.scss"), "Logo",
  function ({
    type = "full",
    ...rest
  }: {
    type?: "full" | "symbol" | "logotype",
    className?: string,
    ref?: Ref<HTMLDivElement>
  } & AdditionalProps): ReactElement | null {

    return (type === "full") ? (
      <div styleName="root" role="img" {...aria({label: "ZpDIC Online"})} {...rest}>
        <SymbolSvg styleName="symbol"/>
        <LogotypeSvg styleName="logo"/>
      </div>
    ) : (type === "logotype") ? (
      <LogotypeSvg styleName="root-logotype" role="img" {...aria({label: "ZpDIC Online"})} {...rest}/>
    ) : (type === "symbol") ? (
      <SymbolSvg styleName="root-symbol" role="img" {...aria({label: "ZpDIC Online"})} {...rest}/>
    ) : null;

  }
);
