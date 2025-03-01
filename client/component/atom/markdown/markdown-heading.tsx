//

import {AnchorHTMLAttributes, ReactElement, ReactNode} from "react";
import {data} from "zographia";
import {create} from "/client/component/create";


export const MarkdownHeading = create(
  require("./markdown-heading.scss"), "MarkdownHeading",
  function ({
    level,
    children,
    ...rest
  }: {
    level: 1 | 2 | 3 | 4 | 5 | 6,
    children?: ReactNode
  } & AnchorHTMLAttributes<HTMLHeadingElement>): ReactElement {

    return (
      <div styleName="root" {...data({level})} {...rest}>
        {children}
      </div>
    );

  }
);
