//

import {ReactElement, Suspense} from "react";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {create} from "/client-new/component/create";


const router = createBrowserRouter([
  {path: "/", lazy: () => import("/client-new/component/page/top-page")}
], {basename: "/next"});


export const Routing = create(
  require("./routing.scss"), "Routing",
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