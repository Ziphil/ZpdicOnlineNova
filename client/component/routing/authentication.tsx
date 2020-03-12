//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Redirect,
  Route,
  RouteProps
} from "react-router-dom";
import {
  GlobalStore
} from "/client/component/store";
import {
  inject,
  observer
} from "/client/util/decorator";


@inject @observer
export class PrivateRoute extends Component<RouteProps & {store?: GlobalStore, redirect: string}, {}> {

  public render(): ReactNode {
    let node = (this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
    return node;
  }

}


@inject @observer
export class GuestRoute extends Component<RouteProps & {store?: GlobalStore, redirect: string}, {}> {

  public render(): ReactNode {
    let node = (!this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
    return node;
  }

}