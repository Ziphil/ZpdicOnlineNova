//

import {AnchorHTMLAttributes, ReactElement, ReactNode} from "react";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


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
      <Link href={href ?? ""} scheme="secondary" variant="underline" {...rest}>
        {children}
      </Link>
    );

  }
);
