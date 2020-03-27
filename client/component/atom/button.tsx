//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./button.scss"))
export class Button extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    position: "alone",
    style: "normal",
    usesIcon: false,
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
          result.then((value) => {
            this.setState({loading: false});
          });
        } else {
          onClick(event);
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
    let styleNames = ["root"];
    if (this.props.position !== "alone") {
      styleNames.push(this.props.position);
    }
    if (this.props.style === "simple") {
      styleNames = ["simple"];
    } else if (this.props.style === "caution") {
      styleNames.push("caution");
    }
    if (this.props.usesIcon) {
      styleNames.push("icon");
    }
    if (this.state.loading) {
      styleNames.push("loading");
    }
    let spinnerNode;
    if (this.props.reactive) {
      spinnerNode = (
        <span styleName="spinner-wrapper">
          <span styleName="spinner"/>
        </span>
      );
    }
    let disabled = this.props.disabled || this.state.loading;
    let node = (
      <button styleName={styleNames.join(" ")} disabled={disabled} onClick={this.handleClick.bind(this)}>
        <span styleName="label">{this.props.label}</span>
        {spinnerNode}
      </button>
    );
    return node;
  }

}


type Props = {
  label: string,
  position: "alone" | "left" | "right",
  style: "simple" | "normal" | "caution",
  usesIcon: boolean,
  reactive: boolean,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | PromiseLike<void>
};
type State = {
  loading: boolean
};