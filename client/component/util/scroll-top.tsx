//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useEffect
} from "react";
import {
  useLocation
} from "react-router-dom";
import {
  create
} from "/client/component/create";


const ScrollTop = create(
  null, "ScrollTop",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    let location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);

    let node = (
      <Fragment>
        {children}
      </Fragment>
    );
    return node;

  }
);


export default ScrollTop;