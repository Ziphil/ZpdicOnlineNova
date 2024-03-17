//

import {ReactElement, Suspense, useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {create} from "/client/component/create";
import {LoadingPage} from "/client/component/page/loading-page";
import {sendAnalyticsEvent} from "/client/util/gtag";


export const ToplevelRoute = create(
  null, "ToplevelRoute",
  function ({
  }: {
  }): ReactElement {

    const location = useLocation();

    useEffect(() => {
      sendAnalyticsEvent("page_view", [["page_path", location.pathname]]);
    }, [location.pathname]);

    return (
      <Suspense fallback={<LoadingPage/>}>
        <Outlet/>
      </Suspense>
    );

  }
);