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
import * as http from "../../util/http";


export class PrivateRoute extends Component<AuthenticationProps, {}> {

  public render(): ReactNode {
    let node = (http.isAuthenticated()) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
    return node;
  }

}


export class GuestRoute extends Component<AuthenticationProps, {}> {

  public render(): ReactNode {
    let node = (!http.isAuthenticated()) ? <Route {...this.props}/> : <Redirect to={this.props.redirect}/>;
    return node;
  }

}


type AuthenticationProps = RouteProps & {
  redirect: string;
};