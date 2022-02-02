//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Icon from "/client/component/atom/icon";
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
    page,
    showBack,
    onOpen,
    onClose,
    onBack,
    children
  }: {
    open?: boolean,
    outsideClosable?: boolean,
    title?: string,
    page?: number,
    showBack?: boolean,
    onOpen?: (event: MouseEvent<HTMLElement>) => void,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onBack?: (event: MouseEvent<HTMLButtonElement>) => void,
    children?: ReactNode
  }): ReactElement {

    let onBackgroundClick = (outsideClosable) ? onClose : undefined;
    let backgroundNode = (open) && (
      <div styleName="background" onClick={onBackgroundClick}/>
    );
    let tabNode = (!open) && (
      <div styleName="tab" onClick={onOpen}>
        <Icon name="edit"/>
      </div>
    );
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