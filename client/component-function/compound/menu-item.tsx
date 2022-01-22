//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import Badge from "/client/component-function/atom/badge";
import {
  StylesRecord,
  create
} from "/client/component-function/create";
import {
  useIntl,
  usePath
} from "/client/component-function/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const MenuItem = create(
  require("./menu-item.scss"), "MenuItem",
  function ({
    label,
    iconLabel,
    badgeValue,
    highlight,
    href,
    onClick,
    styles
  }: {
    label: string,
    iconLabel: string,
    badgeValue?: string | number,
    highlight: boolean,
    href?: string,
    onClick?: (event: MouseEvent<HTMLElement>) => void,
    styles?: StylesRecord
  }): ReactElement {

    let {pushPath} = usePath();

    let handleClick = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      onClick?.(event);
      if (href) {
        pushPath(href);
      }
    }, [href, onClick, pushPath]);

    let styleName = StyleNameUtil.create(
      "root",
      {if: highlight, true: "highlight"}
    );
    let badgeNode = (badgeValue) && (
      <Badge className={styles!["badge"]} value={badgeValue} style={(highlight) ? "highlight" : "normal"}/>
    );
    let node = (
      <a styleName={styleName} href={href} onClick={handleClick}>
        <span styleName="icon">{iconLabel}</span>
        <span styleName="text">{label}</span>
        {badgeNode}
      </a>
    );
    return node;

  }
);


export default MenuItem;