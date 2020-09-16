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
import {
  GlobalStore
} from "/client/component/store";


@style(null, {withRouter: false, inject: true, injectIntl: false, observer: true})
export class PrivateRoute extends Component<RouteProps & {store?: GlobalStore, redirect: string}, {}> {

  public render(): ReactNode {
    let node = (this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
    return node;
  }

}


@style(null, {withRouter: false, inject: true, injectIntl: false, observer: true})
export class GuestRoute extends Component<RouteProps & {store?: GlobalStore, redirect: string}, {}> {

  public render(): ReactNode {
    let node = (!this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
    return node;
  }

}