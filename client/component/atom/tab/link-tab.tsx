/* eslint-disable no-useless-computed-key */

import {ComponentProps, ReactElement, ReactNode, Ref, useCallback} from "react";
import {Path, Link as RouterLink} from "react-router-dom";
import {Tab as ZographiaTab} from "zographia";
import {createWithRef} from "/client/component/create";


export const LinkTab = createWithRef(
  require("./link-tab.scss"), "LinkTab",
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
  } & Omit<ComponentProps<typeof ZographiaTab>, "is">): ReactElement {

    const renderComponent = useCallback(function (props: any): ReactElement {
      return (
        <RouterLink {...getRouterLinkProps(href, useTransition)} {...props}/>
      );
    }, [href, useTransition]);

    return (
      <ZographiaTab styleName="root" is={renderComponent} {...rest}>
        {children}
      </ZographiaTab>
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