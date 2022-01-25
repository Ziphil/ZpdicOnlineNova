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
    let type = this.props.type;
    let redirect = this.props.redirect;
    if (type === "private" && redirect !== undefined) {
      let node = (this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={redirect}/>;
      return node;
    } else if (type === "guest" && redirect !== undefined) {
      let node = (!this.props.store!.user) ? <Route {...this.props}/> : <Redirect to={redirect}/>;
      return node;
    } else {
      let node = <Route {...this.props}/>;
      return node;
    }
  }

}


type Props = {
  type: "private" | "guest" | "none",
  redirect?: string
};
type State = {
};