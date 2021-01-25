//

import * as react from "react";
import {
  ComponentType,
  ErrorInfo,
  ReactNode,
  createElement
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(null, {withRouter: true, inject: false, injectIntl: false, observer: false})
export default class ErrorBoundary extends Component<Props, State> {

  public state: State = {
    error: null,
    errorInfo: null
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({error, errorInfo});
  }

  public componentDidUpdate(props: any): void {
    if (this.props.location !== props.location) {
      this.setState({error: null, errorInfo: null});
    }
  }

  public render(): ReactNode {
    if (this.state.error !== null) {
      let node = createElement(this.props.component, this.state);
      return node;
    } else {
      return this.props.children;
    }
  }

}


type Props = {
  component: ComponentType<State>
};
type State = {
  error: Error | null,
  errorInfo: ErrorInfo | null
};