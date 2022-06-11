//

import * as react from "react";
import {
  Fragment,
  MouseEvent,
  ReactElement,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Icon from "/client/component/atom/icon";
import {
  IconName
} from "/client/component/atom/icon";
import Portal from "/client/component/atom/portal";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  DataUtil
} from "/client/util/data";


const Drawer = create(
  require("./drawer.scss"), "Drawer",
  function ({
    open = false,
    outsideClosable = false,
    title,
    iconName = "arrow-right",
    badgeValue,
    page,
    tabPosition = "center",
    showBack,
    onOpen,
    onClose,
    onBack,
    children
  }: {
    open?: boolean,
    outsideClosable?: boolean,
    title?: string,
    iconName?: IconName,
    badgeValue?: string | number,
    page?: number,
    tabPosition?: "center" | "top" | "bottom",
    showBack?: boolean,
    onOpen?: (event: MouseEvent<HTMLElement>) => void,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onBack?: (event: MouseEvent<HTMLButtonElement>) => void,
    children?: ReactNode
  }): ReactElement {

    const onBackgroundClick = (outsideClosable) ? onClose : undefined;
    const contentContainerData = DataUtil.create({closed: !open});
    const node = (
      <Fragment>
        <Portal>
          {(open) && (
            <div styleName="background" onClick={onBackgroundClick}/>
          )}
          <div styleName="spacer">
            <div styleName="content-container" {...contentContainerData}>
              {(title !== undefined) && <DrawerHeader {...{title, page, showBack, onClose, onBack}}/>}
              <div styleName="content">
                {(page !== undefined && Array.isArray(children)) ? children[page] : children}
              </div>
            </div>
          </div>
        </Portal>
        <Portal position="back">
          {(!open) && (
            <DrawerTab {...{iconName, badgeValue, tabPosition, onOpen}}/>
          )}
        </Portal>
      </Fragment>
    );
    return node;

  }
);


const DrawerHeader = create(
  require("./drawer.scss"),
  function ({
    title,
    page,
    showBack,
    onClose,
    onBack
  }: {
    title: string,
    page?: number,
    showBack?: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onBack?: (event: MouseEvent<HTMLButtonElement>) => void
  }): ReactElement {

    const [, {trans}] = useIntl();

    const node = (
      <div styleName="header">
        <div styleName="left">
          <div styleName="title">{title}</div>
        </div>
        <div styleName="right">
          {(page !== undefined && ((showBack === undefined && page > 0) || showBack)) && (
            <Button label={trans("overlay.back")} iconName="backward" variant="simple" hideLabel={true} onClick={onBack}/>
          )}
          {(
            <Button label={trans("overlay.close")} iconName="times" variant="simple" hideLabel={true} onClick={onClose}/>
          )}
        </div>
      </div>
    );
    return node;

  }
);


const DrawerTab = create(
  require("./drawer.scss"),
  function ({
    iconName,
    badgeValue,
    tabPosition,
    onOpen
  }: {
    iconName: IconName,
    badgeValue?: string | number,
    tabPosition: "center" | "top" | "bottom",
    onOpen?: (event: MouseEvent<HTMLElement>) => void
  }): ReactElement {

    const [, {transNumber}] = useIntl();

    const actualBadgeValue = (typeof badgeValue === "number") ? transNumber(badgeValue) : badgeValue;
    const tabData = DataUtil.create({tabPosition});
    const node = (
      <div styleName="tab" onClick={onOpen} {...tabData}>
        <div styleName="tab-inner">
          <Icon name={iconName}/>
          {(badgeValue !== undefined) && <span styleName="number">{actualBadgeValue}</span>}
        </div>
      </div>
    );
    return node;

  }
);


export default Drawer;