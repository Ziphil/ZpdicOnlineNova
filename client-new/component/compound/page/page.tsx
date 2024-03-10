//

import {ReactElement, ReactNode} from "react";
import {ScrollRestoration} from "react-router-dom";
import {AdditionalProps, data} from "zographia";
import {Title} from "/client-new/component/atom/title";
import {Footer} from "/client-new/component/compound/footer";
import {create} from "/client-new/component/create";


export const Page = create(
  require("./page.scss"), "Page",
  function ({
    title,
    insertPadding = true,
    headerNode,
    children,
    ...rest
  }: {
    title?: string,
    insertPadding?: boolean | {top: boolean, bottom: boolean, horizontal: boolean},
    headerNode?: ReactNode,
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    const insertTopPadding = (typeof insertPadding === "boolean" && insertPadding) || (typeof insertPadding !== "boolean" && insertPadding.top);
    const insertBottomPadding = (typeof insertPadding === "boolean" && insertPadding) || (typeof insertPadding !== "boolean" && insertPadding.bottom);
    const insertHorizontalPadding = (typeof insertPadding === "boolean" && insertPadding) || (typeof insertPadding !== "boolean" && insertPadding.horizontal);

    return (
      <div styleName="root" {...rest}>
        <Title title={title}/>
        <ScrollRestoration/>
        {headerNode}
        <main styleName="main" {...data({insertTopPadding, insertBottomPadding, insertHorizontalPadding})}>
          {children}
        </main>
        <Footer/>
      </div>
    );

  }
);