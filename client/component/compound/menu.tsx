//

import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import {
  IconName
} from "/client/component/atom/icon";
import MenuItem from "/client/component/compound/menu-item";
import {
  create
} from "/client/component/create";
import {
  StyleNameUtil
} from "/client/util/style-name";


const Menu = create(
  require("./menu.scss"), "Menu",
  function ({
    mode,
    specs,
    direction = "horizontal"
  }: {
    mode: string,
    specs: ReadonlyArray<MenuSpec>,
    direction?: "horizontal" | "vertical"
  }): ReactElement {

    let itemNodes = specs.map((spec) => {
      let highlight = spec.mode === mode;
      let itemNode = (
        <MenuItem
          key={spec.label}
          label={spec.label}
          iconName={spec.iconName}
          badgeValue={spec.badgeValue}
          highlight={highlight}
          href={spec.href}
          direction={direction}
          onClick={spec.onClick}
        />
      );
      return itemNode;
    });
    let styleName = StyleNameUtil.create("root", direction);
    let node = (
      <nav styleName={styleName}>
        {itemNodes}
      </nav>
    );
    return node;

  }
);


export type MenuSpec = {mode: string, label: string, iconName: IconName, badgeValue?: string | number, href?: string, onClick?: (event: MouseEvent<HTMLElement>) => void};

export default Menu;