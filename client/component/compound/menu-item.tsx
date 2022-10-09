//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback,
  useContext
} from "react";
import Badge from "/client/component/atom/badge";
import Icon from "/client/component/atom/icon";
import {
  IconName
} from "/client/component/atom/icon";
import {
  menuContext
} from "/client/component/compound/menu";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  usePath
} from "/client/component/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const MenuItem = create(
  require("./menu-item.scss"), "MenuItem",
  function ({
    mode,
    label,
    iconName,
    badgeValue,
    href,
    onClick,
    styles
  }: {
    mode: string,
    label: string,
    iconName: IconName,
    badgeValue?: string | number,
    href?: string,
    onClick?: (event: MouseEvent<HTMLElement>) => void,
    styles?: StylesRecord
  }): ReactElement {

    const {pushPath} = usePath();

    const contextValue = useContext(menuContext);

    const handleClick = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      onClick?.(event);
      if (href) {
        pushPath(href);
      }
    }, [href, onClick, pushPath]);

    const highlight = contextValue.mode === mode;
    const styleName = StyleNameUtil.create(
      "root",
      contextValue.direction,
      {if: highlight, true: "highlight"}
    );
    const node = (
      <a styleName={styleName} href={href} onClick={handleClick}>
        <Icon className={styles!["icon"]} name={iconName}/>
        <span styleName="text">
          <span styleName="dummy">{label}</span>
          {label}
        </span>
        {(badgeValue !== undefined && badgeValue > 0) && (
          <Badge className={styles!["badge"]} value={badgeValue}/>
        )}
      </a>
    );
    return node;

  }
);


export default MenuItem;