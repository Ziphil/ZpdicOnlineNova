//

import {
  useRouter
} from "@tanstack/react-location";
import {
  Fragment,
  ReactElement,
  ReactNode,
  useEffect
} from "react";
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

    const router = useRouter();

    useEffect(() => {
      if (!router.pending) {
        window.scrollTo(0, 0);
      }
    }, [router.pending]);

    const node = (
      <Fragment>
        {children}
      </Fragment>
    );
    return node;

  }
);


export default ScrollTop;