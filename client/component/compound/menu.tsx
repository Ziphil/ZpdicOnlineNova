//

import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import {
  IconName
} from "/client/component/atom/icon";
import MenuItem from "/client/component/compound/menu-item";
import {
  create
} from "/client/component/create";
import {
  useLogout,
  usePath
} from "/client/component/hook";


const Menu = create(
  require("./menu.scss"), "Menu",
  function ({
    mode,
    specs
  }: {
    mode: string,
    specs: ReadonlyArray<{mode: string, label: string, iconName: IconName, badgeValue?: string | number, href: string}>
  }): ReactElement {

    let {pushPath} = usePath();
    let logout = useLogout();

    let performLogout = useCallback(async function (): Promise<void> {
      let response = await logout();
      if (response.status === 200) {
        pushPath("/");
      }
    }, [pushPath, logout]);

    let itemNodes = specs.map((spec, index) => {
      let highlight = spec.mode === mode;
      let href = (spec.mode !== "logout") ? spec.href : undefined;
      let onClick = (spec.mode === "logout") ? performLogout : undefined;
      return <MenuItem label={spec.label} iconName={spec.iconName} badgeValue={spec.badgeValue} href={href} highlight={highlight} onClick={onClick} key={index}/>;
    });
    let node = (
      <nav styleName="root">
        {itemNodes}
      </nav>
    );
    return node;

  }
);


export default Menu;