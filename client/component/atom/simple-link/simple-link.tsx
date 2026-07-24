//

import {ReactElement, ReactNode, Ref} from "react";
import {Path, Link as RouterLink} from "react-router";
import {createWithRef} from "/client/component/create";


export const SimpleLink = createWithRef(
  require("./simple-link.scss"), "SimpleLink",
  function ({
    href,
    useTransition = false,
    children,
    ...rest
  }: {
    href: string | Partial<Path>,
    useTransition?: boolean,
    children?: ReactNode,
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  }): ReactElement {

    return (
      <RouterLink
        styleName="root"
        to={href}
        viewTransition={useTransition}
        {...rest}
      >
        {children}
      </RouterLink>
    );

  }
);