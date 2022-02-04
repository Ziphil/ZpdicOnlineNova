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


const Menu = create(
  require("./menu.scss"), "Menu",
  function ({
    mode,
    specs
  }: {
    mode: string,
    specs: ReadonlyArray<MenuSpec>
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
          onClick={spec.onClick}
        />
      );
      return itemNode;
    });
    let node = (
      <nav styleName="root">
        {itemNodes}
      </nav>
    );
    return node;

  }
);


export type MenuSpec = {mode: string, label: string, iconName: IconName, badgeValue?: string | number, href?: string, onClick?: (event: MouseEvent<HTMLElement>) => void};

export default Menu;