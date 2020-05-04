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
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./alert.scss"))
export class Alert extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    open: false,
    outsideClosable: false,
    confirmLabel: "実行",
    cancelLabel: "キャンセル"
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
    let node = (
      <Modal open={this.props.open} outsideClosable={this.props.outsideClosable} onClose={this.props.onClose}>
        <div styleName="content">
          <div styleName="text-wrapper">
            <div styleName="icon">{this.props.iconLabel}</div>
            <p styleName="text">{this.props.text}</p>
          </div>
          <div styleName="button">
            <Button label={this.props.cancelLabel} onClick={this.handleCancel.bind(this)}/>
            <Button label={this.props.confirmLabel} style="caution" onClick={this.handleConfirm.bind(this)}/>
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
  confirmLabel: string,
  cancelLabel: string,
  open: boolean,
  outsideClosable: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => void,
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};