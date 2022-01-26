//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Modal from "/client/component/atom/modal";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const Overlay = create(
  require("./overlay.scss"), "Overlay",
  function ({
    size = "small",
    open = false,
    outsideClosable = false,
    title,
    page,
    showBack,
    onClose,
    onBack,
    children
  }: {
    size?: "large" | "small",
    open?: boolean,
    outsideClosable?: boolean,
    title?: string,
    page?: number,
    showBack?: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onBack?: (event: MouseEvent<HTMLButtonElement>) => void,
    children?: ReactNode
  }): ReactElement {

    let contentStyleName = StyleNameUtil.create("content-wrapper", size);
    let childrenNode = (page !== undefined && Array.isArray(children)) ? children[page] : children;
    let node = (
      <Modal open={open} outsideClosable={outsideClosable} onClose={onClose}>
        <div styleName={contentStyleName}>
          <OverlayHeader {...{title, page, showBack, onClose, onBack}}/>
          <div styleName="content">
            {childrenNode}
          </div>
        </div>
      </Modal>
    );
    return node;

  }
);


const OverlayHeader = create(
  require("./overlay.scss"),
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


export default Overlay;