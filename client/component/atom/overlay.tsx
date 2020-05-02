//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Portal
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  createStyleName
} from "/client/util/style-names";


@applyStyle(require("./overlay.scss"))
export class Overlay extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    size: "small",
    open: false,
    outsideClosable: false
  };

  public render(): ReactNode {
    let contentStyleName = createStyleName("content-wrapper", this.props.size);
    let displayedChildren = this.props.children;
    if (this.props.page !== undefined && Array.isArray(this.props.children)) {
      displayedChildren = this.props.children[this.props.page];
    }
    let headerNode = (this.props.title !== undefined) && (() => {
      let backNode = (this.props.page !== undefined && this.props.page > 0) && (
        <Button label="戻る" iconLabel="&#xF04A;" style="simple" onClick={this.props.onBack}/>
      );
      let headerNode = (
        <div styleName="header">
          <div styleName="left">
            {this.props.title}
          </div>
          <div styleName="right">
            {backNode}
            <Button label="閉じる" iconLabel="&#xF00D;" style="simple" onClick={this.props.onClose}/>
          </div>
        </div>
      );
      return headerNode;
    })();
    let onBackgroundClick = (this.props.outsideClosable) ? this.props.onClose : undefined;
    let node = (this.props.open) && (
      <Portal>
        <div styleName="background" onClick={onBackgroundClick}/>
        <div styleName="spacer">
          <div styleName={contentStyleName}>
            {headerNode}
            <div styleName="content">
              {displayedChildren}
            </div>
          </div>
        </div>
      </Portal>
    );
    return node;
  }

}


type Props = {
  size: "large" | "small",
  open: boolean,
  outsideClosable: boolean,
  title?: string,
  page?: number,
  onClose?: (event: MouseEvent<HTMLElement>) => void,
  onBack?: (event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};