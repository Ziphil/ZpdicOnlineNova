//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import {
  create
} from "/client/component-function/create";
import {
  usePath
} from "/client/component-function/hook";


const HeaderMenuItem = create(
  require("./header-menu-item.scss"), "HeaderMenuItem",
  function ({
    label,
    iconLabel,
    href,
    onClick
  }: {
    label: string,
    iconLabel?: string,
    href: string,
    onClick?: (event: MouseEvent<HTMLElement>) => void
  }): ReactElement {

    let {pushPath} = usePath();

    let handleClick = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      onClick?.(event);
      if (href) {
        pushPath(href);
      }
    }, [href, onClick, pushPath]);

    let iconNode = (iconLabel !== undefined) && (
      <span styleName="icon">{iconLabel}</span>
    );
    let node = (
      <a styleName="root" href={href} onClick={handleClick}>
        {iconNode}
        <span styleName="text">{label}</span>
      </a>
    );
    return node;

  }
);


export default HeaderMenuItem;