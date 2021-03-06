//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Portal from "/client/component/atom/portal";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./modal.scss"))
export default class Modal extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    outsideClosable: false
  };

  public render(): ReactNode {
    let onBackgroundClick = (this.props.outsideClosable) ? this.props.onClose : undefined;
    let node = (this.props.open) && (
      <Portal>
        <div styleName="background" onClick={onBackgroundClick}/>
        <div styleName="spacer">
          {this.props.children}
        </div>
      </Portal>
    );
    return node;
  }

}


type Props = {
  open: boolean,
  outsideClosable: boolean,
  onClose?: (event: MouseEvent<HTMLElement>) => void
};
type DefaultProps = {
  outsideClosable: boolean
};
type State = {
};