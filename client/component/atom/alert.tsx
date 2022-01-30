//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import Icon from "/client/component/atom/icon";
import Modal from "/client/component/atom/modal";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


const Alert = create(
  require("./alert.scss"), "Alert",
  function ({
    text,
    iconName = "triangle-exclamation",
    confirmLabel = null,
    cancelLabel = null,
    open = false,
    outsideClosable = false,
    onClose,
    onConfirm,
    onCancel
  }: {
    text: string,
    iconName?: string,
    confirmLabel?: string | null,
    cancelLabel?: string | null,
    open?: boolean,
    outsideClosable?: boolean,
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void,
    onCancel?: (event: MouseEvent<HTMLButtonElement>) => void
  }): ReactElement {

    let [, {trans}] = useIntl();

    let handleConfirm = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      onClose?.(event);
      onConfirm?.(event);
    }, [onClose, onConfirm]);

    let handleCancel = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      onClose?.(event);
      onCancel?.(event);
    }, [onClose, onCancel]);

    let actualCancelLabel = cancelLabel ?? trans("alert.cancel");
    let actualConfirmLabel = confirmLabel ?? trans("alert.confirm");
    let node = (
      <Modal open={open} outsideClosable={outsideClosable} onClose={onClose}>
        <div styleName="content">
          <div styleName="text-wrapper">
            <div styleName="icon"><Icon name={iconName}/></div>
            <p styleName="text">{text}</p>
          </div>
          <div styleName="button">
            <Button label={actualCancelLabel} onClick={handleCancel}/>
            <Button label={actualConfirmLabel} style="caution" onClick={handleConfirm}/>
          </div>
        </div>
      </Modal>
    );
    return node;

  }
);


export default Alert;