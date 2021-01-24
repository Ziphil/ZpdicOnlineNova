//

import * as react from "react";
import {
  ComponentType,
  ReactNode,
  createElement
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(null, {withRouter: false, inject: false, injectIntl: false, observer: false})
export default class ErrorBoundary extends Component<Props, State> {

  public state: State = {
    error: null
  };

  public componentDidCatch(error: any, info: any): void {
    this.setState({error});
  }

  public render(): ReactNode {
    let error = this.state.error;
    if (error !== null) {
      let node = createElement(this.props.component, {error});
      return node;
    } else {
      return this.props.children;
    }
  }

}


type Props = {
  component: ComponentType<{error: any}>
};
type State = {
  error: any | null;
};