//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Redirect,
  Route,
  RouteProps
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(null, {withRouter: false, inject: true, injectIntl: false, observer: true})
export default class Authenticator extends Component<RouteProps & Props, State> {

  public render(): ReactNode {
    if (this.props.type === "private") {
      let node = (this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
      return node;
    } else {
      let node = (!this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
      return node;
    }
  }

}


type Props = {
  type: "private" | "guest",
  redirect: string
};
type State = {
};