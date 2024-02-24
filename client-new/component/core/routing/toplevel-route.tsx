//

import {ReactElement, Suspense, useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {create} from "/client-new/component/create";
import {LoadingPage} from "/client-new/component/page/loading-page";
import {sendAnalyticsEvent} from "/client-new/util/gtag";


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