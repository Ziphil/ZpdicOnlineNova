//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./label.scss"))
export default class Label extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal",
    showRequired: false,
    showOptional: false
  };

  public render(): ReactNode {
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.style === "error", true: "error"}
    );
    let requiredNode = (this.props.showRequired) && (
      <span styleName="required">({this.trans("label.required")})</span>
    );
    let optionalNode = (this.props.showOptional) && (
      <span styleName="optional">({this.trans("label.optional")})</span>
    );
    let node = (this.props.text !== undefined) && (
      <div styleName={styleName} className={this.props.className}>
        {this.props.text}
        {requiredNode}
        {optionalNode}
      </div>
    );
    return node;
  }

}


type Props = {
  text?: string,
  style: "normal" | "error",
  showRequired: boolean,
  showOptional: boolean,
  className?: string
};
type DefaultProps = {
  style: "normal" | "error",
  showRequired: boolean,
  showOptional: boolean
};
type State = {
};