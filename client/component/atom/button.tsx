//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@applyStyle(require("./button.scss"))
export default class Button extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    position: "alone",
    style: "normal",
    hideLabel: false,
    reactive: false,
    disabled: false
  };
  public state: State = {
    loading: false
  };

  private handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    let onClick = this.props.onClick;
    if (this.props.reactive) {
      this.setState({loading: true});
      if (onClick) {
        let result = onClick(event);
        if (typeof result === "object" && typeof result.then === "function") {
          result.then(() => {
            this.setState({loading: false});
          });
        } else {
          this.setState({loading: false});
        }
      } else {
        this.setState({loading: false});
      }
    } else {
      if (onClick) {
        onClick(event);
      }
    }
  }

  public render(): ReactNode {
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.label === undefined, true: "only-icon"},
      {if: this.props.position !== "alone", true: this.props.position},
      {if: this.props.style === "simple" || this.props.style === "link", true: "simple", false: "button"},
      {if: this.props.style === "link", true: "link"},
      {if: this.props.style === "caution", true: "caution"},
      {if: this.props.style === "information", true: "information"},
      {if: this.props.hideLabel, true: "hide-label"},
      {if: this.state.loading, true: "loading"}
    );
    let labelNode = (this.props.label !== undefined) && <span styleName="label">{this.props.label}</span>;
    let iconNode = (this.props.iconLabel !== undefined) && <span styleName="icon">{this.props.iconLabel}</span>;
    let spinnerNode = (this.props.reactive) && (
      <span styleName="spinner-wrapper">
        <span styleName="spinner"/>
      </span>
    );
    let disabled = this.props.disabled || this.state.loading;
    let node = (
      <button styleName={styleName} className={this.props.className} disabled={disabled} onClick={this.handleClick.bind(this)}>
        {iconNode}
        {labelNode}
        {spinnerNode}
      </button>
    );
    return node;
  }

}


type Props = {
  label?: string,
  iconLabel?: string,
  position: "alone" | "left" | "right" | "middle",
  style: "normal" | "caution" | "information" | "simple" | "link",
  hideLabel: boolean,
  reactive: boolean,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  className?: string
};
type DefaultProps = {
  position: "alone" | "left" | "right" | "middle",
  style: "normal" | "caution" | "information" | "simple" | "link",
  hideLabel: boolean,
  reactive: boolean,
  disabled: boolean
};
type State = {
  loading: boolean
};