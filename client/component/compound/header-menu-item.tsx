//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import Icon from "/client/component/atom/icon";
import {
  IconName
} from "/client/component/atom/icon";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  usePath
} from "/client/component/hook";


const HeaderMenuItem = create(
  require("./header-menu-item.scss"), "HeaderMenuItem",
  function ({
    label,
    iconName,
    href,
    onClick,
    styles
  }: {
    label: string,
    iconName?: IconName,
    href: string,
    onClick?: (event: MouseEvent<HTMLElement>) => void,
    styles?: StylesRecord
  }): ReactElement {

    const {pushPath} = usePath();

    const handleClick = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      onClick?.(event);
      if (href) {
        pushPath(href);
      }
    }, [href, onClick, pushPath]);

    const iconNode = (iconName !== undefined) && (
      <Icon className={styles!["icon"]} name={iconName}/>
    );
    const node = (
      <a styleName="root" href={href} onClick={handleClick}>
        {iconNode}
        <span styleName="text">{label}</span>
      </a>
    );
    return node;

  }
);


export default HeaderMenuItem;