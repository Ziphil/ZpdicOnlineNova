//

import {
  Navigate
} from "@tanstack/react-location";
import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
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
    node
  }: {
    type: "private" | "guest" | "none",
    redirect?: string,
    node: ReactNode
  }): ReactElement {

    let [user] = useUser();

    if (type === "private" && redirect !== undefined) {
      let actualNode = (user !== null) ? <>{node}</> : <Navigate to={redirect} replace={true}/>;
      return actualNode;
    } else if (type === "guest" && redirect !== undefined) {
      let actualNode = (user === null) ? <>{node}</> : <Navigate to={redirect} replace={true}/>;
      return actualNode;
    } else {
      return <>{node}</>;
    }

  }
);


export default Authenticator;