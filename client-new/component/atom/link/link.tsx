/* eslint-disable no-useless-computed-key */

import {ComponentProps, ReactElement, ReactNode, Ref} from "react";
import {Path, Link as RouterLink} from "react-router-dom";
import {Link as ZographiaLink} from "zographia";
import {createWithRef} from "/client-new/component/create";


export const Link = createWithRef(
  require("./link.scss"), "Link",
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
  } & Omit<ComponentProps<typeof ZographiaLink>, "href" | "is">): ReactElement {

    return (
      <ZographiaLink
        styleName="root"
        is={(props) => <RouterLink {...getRouterLinkProps(href, useTransition)} {...props}/>}
        {...rest}
      >
        {children}
      </ZographiaLink>
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