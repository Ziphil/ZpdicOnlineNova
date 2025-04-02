/* eslint-disable no-useless-computed-key */

import {ComponentProps, ReactElement, ReactNode, Ref, useCallback} from "react";
import {Path, Link as RouterLink} from "react-router-dom";
import {Link as ZographiaLink} from "zographia";
import {createWithRef} from "/client/component/create";


export const Link = createWithRef(
  require("./link.scss"), "Link",
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
  } & Omit<ComponentProps<typeof ZographiaLink>, "href" | "is">): ReactElement {

    const renderComponent = useCallback(function (props: any): ReactElement {
      return (
        <RouterLink {...getRouterLinkProps(href, useTransition)} {...props}/>
      );
    }, [href, useTransition]);

    return (href === "/api") ? (
      <ZographiaLink styleName="root" href={href} {...rest}>
        {children}
      </ZographiaLink>
    ) : (
      <ZographiaLink styleName="root" is={renderComponent} {...rest}>
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