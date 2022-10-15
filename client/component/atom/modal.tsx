//

import {
  MouseEvent,
  ReactElement,
  ReactNode
} from "react";
import Portal from "/client/component/atom/portal";
import {
  create
} from "/client/component/create";


const Modal = create(
  require("./modal.scss"), "Modal",
  function ({
    open,
    outsideClosable = false,
    onClose,
    children
  }: {
    open: boolean,
    outsideClosable: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    children?: ReactNode
  }): ReactElement | null {

    const onBackgroundClick = (outsideClosable) ? onClose : undefined;
    const node = (open) && (
      <Portal>
        <div styleName="background" onClick={onBackgroundClick}/>
        <div styleName="spacer">
          {children}
        </div>
      </Portal>
    );
    return node || null;

  }
);


export default Modal;