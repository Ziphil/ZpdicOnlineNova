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
import {
  createStyleName
} from "/client/util/style-name";


@applyStyle(require("./overlay.scss"))
export class Overlay extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    size: "small",
    open: false,
    outsideClosable: false
  };

  public render(): ReactNode {
    let contentStyleName = createStyleName("content-wrapper", this.props.size);
    let displayedChildren = (() => {
      if (this.props.page !== undefined && Array.isArray(this.props.children)) {
        return this.props.children[this.props.page];
      } else {
        return this.props.children;
      }
    })();
    let headerNode = (this.props.title !== undefined) && (() => {
      let backButtonNode = (this.props.page !== undefined && this.props.page > 0) && (
        <Button label="戻る" iconLabel="&#xF04A;" style="simple" hideLabel={true} onClick={this.props.onBack}/>
      );
      let closeButtonNode = (
        <Button label="閉じる" iconLabel="&#xF00D;" style="simple" hideLabel={true} onClick={this.props.onClose}/>
      );
      let headerNode = (
        <div styleName="header">
          <div styleName="left">
            <div styleName="title">{this.props.title}</div>
          </div>
          <div styleName="right">
            {backButtonNode}
            {closeButtonNode}
          </div>
        </div>
      );
      return headerNode;
    })();
    let node = (
      <Modal open={this.props.open} outsideClosable={this.props.outsideClosable} onClose={this.props.onClose}>
        <div styleName={contentStyleName}>
          {headerNode}
          <div styleName="content">
            {displayedChildren}
          </div>
        </div>
      </Modal>
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