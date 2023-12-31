//

import {ReactElement, Suspense} from "react";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {create} from "/client-new/component/create";


const router = createBrowserRouter([
  {path: "/", lazy: () => import("/client-new/component/page/top-page")},
  {path: "/dictionary", lazy: () => import("/client-new/component/page/dictionary-list-page")},
  {path: "/notification", lazy: () => import("/client-new/component/page/notification-list-page")}
], {basename: "/next"});


export const Routing = create(
  null, "Routing",
  function ({
  }: {
  }): ReactElement {

    return (
      <Suspense fallback={<div/>}>
        <RouterProvider router={router}/>
      </Suspense>
    );

  }
);