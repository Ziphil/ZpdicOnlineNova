/* eslint-disable no-useless-computed-key */

import {ComponentProps, ReactElement, ReactNode, Ref} from "react";
import {Path, Link as RouterLink} from "react-router-dom";
import {Link} from "zographia";
import {createWithRef} from "/client-new/component/create";


export const TransitionLink = createWithRef(
  require("./transition-link.scss"), "TransitionLink",
  function ({
    to,
    children,
    ...rest
  }: {
    to: string | Partial<Path>,
    children?: ReactNode,
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  } & Omit<ComponentProps<typeof Link>, "href">): ReactElement {

    return (
      <Link styleName="root" is={(props) => <RouterLink to={to} {...routerLinkProps} {...props}/>} {...rest}>
        {children}
      </Link>
    );

  }
);


const routerLinkProps = {["unstable_viewTransition"]: true};