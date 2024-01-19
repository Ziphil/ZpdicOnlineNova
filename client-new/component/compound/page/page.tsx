//

import {ReactElement, ReactNode} from "react";
import {ScrollRestoration} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {data} from "/client/util/data";
import {Footer} from "/client-new/component/compound/footer";
import {create} from "/client-new/component/create";


export const Page = create(
  require("./page.scss"), "Page",
  function ({
    insertPadding = true,
    headerNode,
    children,
    ...rest
  }: {
    insertPadding?: boolean,
    headerNode?: ReactNode,
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" {...rest}>
        <ScrollRestoration/>
        {headerNode}
        <main styleName="main" {...data({insertPadding})}>
          {children}
        </main>
        <Footer/>
      </div>
    );

  }
);