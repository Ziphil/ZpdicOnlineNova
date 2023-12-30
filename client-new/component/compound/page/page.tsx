//

import {ReactElement, ReactNode} from "react";
import {ScrollRestoration} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {data} from "/client/util/data";
import {Footer} from "/client-new/component/compound/footer";
import {Header} from "/client-new/component/compound/header";
import {create} from "/client-new/component/create";


export const Page = create(
  require("./page.scss"), "Page",
  function ({
    showHeader = true,
    insertPadding = true,
    children,
    ...rest
  }: {
    showHeader?: boolean,
    insertPadding?: boolean,
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" {...rest}>
        <ScrollRestoration/>
        {(showHeader) && <Header/>}
        <main styleName="main" {...data({insertPadding})}>
          {children}
        </main>
        <Footer/>
      </div>
    );

  }
);