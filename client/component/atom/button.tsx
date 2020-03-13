//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./button.scss"))
export class Button extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    position: null,
    icon: null,
    color: null,
    reactive: true,
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
        if (result instanceof Promise) {
          console.log("Result is a promise");
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
    if (this.props.color === "simple") {
      styleNames = ["simple"];
    }
    if (this.props.position) {
      styleNames.push(this.props.position);
    }
    if (this.props.icon) {
      styleNames.push("icon");
      styleNames.push(this.props.icon);
    }
    if (this.state.loading) {
      styleNames.push("loading");
    }
    let disabled = this.props.disabled || this.state.loading;
    let node = (
      <button styleName={styleNames.join(" ")} disabled={disabled} onClick={this.handleClick.bind(this)}>
        <span styleName="label">{this.props.label}</span>
        <span styleName="spinner-wrapper">
          <span styleName="spinner"/>
        </span>
      </button>
    );
    return node;
  }

}


type Props = {
  label: string,
  position: "left" | "right" | null,
  icon: "awesome" | null,
  color: "simple" | null,
  reactive: boolean,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
  loading: boolean
};