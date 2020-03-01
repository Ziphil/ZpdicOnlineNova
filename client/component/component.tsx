//

import {
  Component
} from "react";
import {
  RouteComponentProps
} from "react-router-dom";


export class ComponentBase<P = {}, S = {}, Q = {}, T = any> extends Component<RouteComponentProps<Q> & P, S, T> {

  protected async fetch(): Promise<void> {
  }

  public async componentDidMount(): Promise<void> {
    try {
      await this.fetch();
    } catch (error) {
      this.props.history.push("/login");
    }
  }

}