//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  Redirect,
  Route,
  RouteProps
} from "react-router-dom";
import {
  create
} from "/client/component/create";
import {
  useUser
} from "/client/component/hook";


const Authenticator = create(
  null, "Authenticator",
  function ({
    type,
    redirect,
    ...props
  }: {
    type: "private" | "guest" | "none",
    redirect?: string
  } & RouteProps): ReactElement {

    let [user] = useUser();

    if (type === "private" && redirect !== undefined) {
      let node = (user !== null) ? <Route {...props}/> : <Redirect to={redirect}/>;
      return node;
    } else if (type === "guest" && redirect !== undefined) {
      let node = (user === null) ? <Route {...props}/> : <Redirect to={redirect}/>;
      return node;
    } else {
      let node = <Route {...props}/>;
      return node;
    }

  }
);


export default Authenticator;