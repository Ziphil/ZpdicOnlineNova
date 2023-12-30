//

import {AnchorHTMLAttributes, ReactElement, ReactNode} from "react";
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";


export const MarkdownAnchor = create(
  require("./markdown-anchor.scss"), "MarkdownAnchor",
  function ({
    href,
    children,
    ...rest
  }: {
    href?: string,
    children?: ReactNode
  } & AnchorHTMLAttributes<HTMLAnchorElement>): ReactElement {

    return (
      <Link href={href ?? ""} {...rest}>
        {children}
      </Link>
    );

  }
);
