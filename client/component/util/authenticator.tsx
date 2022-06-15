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
  useMe
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

    const [me] = useMe();

    if (type === "private" && redirect !== undefined) {
      const actualNode = (me !== null) ? <>{node}</> : <Navigate to={redirect} replace={true}/>;
      return actualNode;
    } else if (type === "guest" && redirect !== undefined) {
      const actualNode = (me === null) ? <>{node}</> : <Navigate to={redirect} replace={true}/>;
      return actualNode;
    } else {
      return <>{node}</>;
    }

  }
);


export default Authenticator;