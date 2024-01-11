/* eslint-disable no-useless-computed-key */

import {ReactElement, ReactNode, Ref} from "react";
import {Path, Link as RouterLink} from "react-router-dom";
import {createWithRef} from "/client-new/component/create";


export const SimpleLink = createWithRef(
  require("./simple-link.scss"), "SimpleLink",
  function ({
    href,
    useTransition = true,
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
        {...getRouterLinkProps(href, useTransition)}
        {...rest}
      >
        {children}
      </RouterLink>
    );

  }
);


function getRouterLinkProps(href: string | Partial<Path>, useTransition: boolean): any {
  const props = {
    to: href,
    ["unstable_viewTransition"]: useTransition
  };
  return props;
};