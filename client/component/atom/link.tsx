//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  create
} from "/client/component/create";
import {
  usePath
} from "/client/component/hook";


const Link = create(
  require("./link.scss"), "Link",
  function ({
    href,
    target = "auto",
    style = "normal",
    onClick,
    className,
    children
  }: {
    href: string,
    target?: "self" | "blank" | "auto",
    style?: "plane" | "normal",
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    const {pushPath} = usePath();

    const handleClick = useCallback(function (event: MouseEvent<HTMLAnchorElement>): void {
      event.preventDefault();
      onClick?.(event);
      if (href) {
        const actualTarget = (() => {
          if (target === "auto") {
            if (href.includes(location.host) || (!href.startsWith("http") && !href.startsWith("//"))) {
              return "self";
            } else {
              return "blank";
            }
          } else {
            return target;
          }
        })();
        if (actualTarget === "self") {
          const shortHref = href.replace(/^(\w+?):\/\//, "").replace(location.host, "");
          pushPath(shortHref);
        } else {
          window.open(href);
        }
      }
    }, [href, target, onClick, pushPath]);

    const styleName = (style === "plane") ? "plane" : "link";
    const node = (
      <a styleName={styleName} className={className} href={href} onClick={handleClick}>
        {children}
      </a>
    );
    return node;

  }
);


export default Link;