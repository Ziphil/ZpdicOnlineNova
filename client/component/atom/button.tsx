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
import {
  createStyleName
} from "/client/util/style-names";


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
    let styleName = createStyleName(
      "root",
      {if: this.props.position !== "alone", true: this.props.position},
      {if: this.props.style === "simple", true: "simple", false: "button"},
      {if: this.props.style === "caution", true: "caution"},
      {if: this.props.usesIcon, true: "icon"},
      {if: this.state.loading, true: "loading"}
    );
    let spinnerNode = this.props.reactive && (
      <span styleName="spinner-wrapper">
        <span styleName="spinner"/>
      </span>
    );
    let disabled = this.props.disabled || this.state.loading;
    let node = (
      <button styleName={styleName} className={this.props.className} disabled={disabled} onClick={this.handleClick.bind(this)}>
        <span styleName="label">{this.props.label}</span>
        {spinnerNode}
      </button>
    );
    return node;
  }

}


type Props = {
  label: string,
  position: "alone" | "left" | "right" | "middle",
  style: "simple" | "normal" | "caution",
  usesIcon: boolean,
  reactive: boolean,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | PromiseLike<void>,
  className?: string
};
type State = {
  loading: boolean
};