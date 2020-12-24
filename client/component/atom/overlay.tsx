//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Modal from "/client/component/atom/modal";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./overlay.scss"))
export default class Overlay extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    size: "small",
    open: false,
    outsideClosable: false
  };

  private renderHeader(): ReactNode {
    if (this.props.title !== undefined) {
      let backButtonNode = (this.props.page !== undefined && this.props.page > 0) && (
        <Button label={this.trans("overlay.back")} iconLabel="&#xF04A;" style="simple" hideLabel={true} onClick={this.props.onBack}/>
      );
      let closeButtonNode = (
        <Button label={this.trans("overlay.close")} iconLabel="&#xF00D;" style="simple" hideLabel={true} onClick={this.props.onClose}/>
      );
      let node = (
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
      return node;
    } else {
      return null;
    }
  }

  private renderChildren(): ReactNode {
    if (this.props.page !== undefined && Array.isArray(this.props.children)) {
      return this.props.children[this.props.page];
    } else {
      return this.props.children;
    }
  }

  public render(): ReactNode {
    let contentStyleName = StyleNameUtil.create("content-wrapper", this.props.size);
    let headerNode = this.renderHeader();
    let childrenNode = this.renderChildren();
    let node = (
      <Modal open={this.props.open} outsideClosable={this.props.outsideClosable} onClose={this.props.onClose}>
        <div styleName={contentStyleName}>
          {headerNode}
          <div styleName="content">
            {childrenNode}
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
type DefaultProps = {
  size: "large" | "small",
  open: boolean,
  outsideClosable: boolean
};
type State = {
};