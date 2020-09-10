//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Modal
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle,
  intl
} from "/client/component/decorator";


@intl
@applyStyle(require("./alert.scss"))
export class Alert extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    open: false,
    outsideClosable: false,
    confirmLabel: null,
    cancelLabel: null
  };

  private handleConfirm(event: MouseEvent<HTMLButtonElement>): void {
    if (this.props.onClose) {
      this.props.onClose(event);
    }
    if (this.props.onConfirm) {
      this.props.onConfirm(event);
    }
  }

  private handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    if (this.props.onClose) {
      this.props.onClose(event);
    }
    if (this.props.onCancel) {
      this.props.onCancel(event);
    }
  }

  public render(): ReactNode {
    let cancelLabel = this.props.cancelLabel ?? this.trans("alert.cancel");
    let confirmLabel = this.props.confirmLabel ?? this.trans("alert.confirm");
    let node = (
      <Modal open={this.props.open} outsideClosable={this.props.outsideClosable} onClose={this.props.onClose}>
        <div styleName="content">
          <div styleName="text-wrapper">
            <div styleName="icon">{this.props.iconLabel}</div>
            <p styleName="text">{this.props.text}</p>
          </div>
          <div styleName="button">
            <Button label={cancelLabel} onClick={this.handleCancel.bind(this)}/>
            <Button label={confirmLabel} style="caution" onClick={this.handleConfirm.bind(this)}/>
          </div>
        </div>
      </Modal>
    );
    return node;
  }

}


type Props = {
  text: string,
  iconLabel: string,
  confirmLabel: string | null,
  cancelLabel: string | null,
  open: boolean,
  outsideClosable: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => void,
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void
};
type DefaultProps = {
  open: boolean,
  outsideClosable: boolean,
  confirmLabel: string | null,
  cancelLabel: string | null
};
type State = {
};