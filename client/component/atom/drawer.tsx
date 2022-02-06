//

import * as react from "react";
import {
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
  StyleNameUtil
} from "/client/util/style-name";


const Drawer = create(
  require("./drawer.scss"), "Drawer",
  function ({
    open = false,
    outsideClosable = false,
    title,
    iconName = "arrow-right",
    badgeValue,
    page,
    position = "center",
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
    position?: "center" | "top" | "bottom",
    showBack?: boolean,
    onOpen?: (event: MouseEvent<HTMLElement>) => void,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onBack?: (event: MouseEvent<HTMLButtonElement>) => void,
    children?: ReactNode
  }): ReactElement {

    let [, {transNumber}] = useIntl();

    let onBackgroundClick = (outsideClosable) ? onClose : undefined;
    let backgroundNode = (open) && (
      <div styleName="background" onClick={onBackgroundClick}/>
    );
    let tabNode = (!open) && (() => {
      let actualBadgeValue = (typeof badgeValue === "number") ? transNumber(badgeValue) : badgeValue;
      let badgeNode = (badgeValue !== undefined) && <span styleName="number">{actualBadgeValue}</span>;
      let tabStyleName = StyleNameUtil.create("tab", position);
      let tabNode = (
        <div styleName={tabStyleName} onClick={onOpen}>
          <div styleName="tab-inner">
            <Icon name={iconName}/>
            {badgeNode}
          </div>
        </div>
      );
      return tabNode;
    })();
    let childrenNode = (page !== undefined && Array.isArray(children)) ? children[page] : children;
    let contentWrapperStyleName = StyleNameUtil.create(
      "content-wrapper",
      {if: open, false: "closed"}
    );
    let node = (
      <Portal>
        {backgroundNode}
        <div styleName="spacer">
          <div styleName={contentWrapperStyleName}>
            <DrawerHeader {...{title, page, showBack, onClose, onBack}}/>
            {tabNode}
            <div styleName="content">
              {childrenNode}
            </div>
          </div>
        </div>
      </Portal>
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
    title?: string,
    page?: number,
    showBack?: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onBack?: (event: MouseEvent<HTMLButtonElement>) => void
  }): ReactElement | null {

    let [, {trans}] = useIntl();

    if (title !== undefined) {
      let backButtonNode = (page !== undefined && ((showBack === undefined && page > 0) || showBack)) && (
        <Button label={trans("overlay.back")} iconName="backward" style="simple" hideLabel={true} onClick={onBack}/>
      );
      let closeButtonNode = (
        <Button label={trans("overlay.close")} iconName="times" style="simple" hideLabel={true} onClick={onClose}/>
      );
      let node = (
        <div styleName="header">
          <div styleName="left">
            <div styleName="title">{title}</div>
          </div>
          <div styleName="right">
            {backButtonNode}
            {closeButtonNode}
          </div>
        </div>
      );
      return node;
    } else {
      return null;
    }

  }
);


export default Drawer;