//

import {ReactElement, Suspense} from "react";
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom";
import {create} from "/client-new/component/create";
import {ErrorPage} from "/client-new/component/page/error-page";


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" errorElement={<ErrorPage/>}>
    <Route path="/" lazy={() => import("/client-new/component/page/top-page")}/>
    <Route path="/dictionary" lazy={() => import("/client-new/component/page/dictionary-list-page")}/>
    <Route path="/dictionary/:identifier" lazy={() => import("/client-new/component/page/dictionary-page")}/>
    <Route path="/dictionary/:identifier/word/new" lazy={() => import("/client-new/component/page/add-word-page")}/>
    <Route path="/dictionary/:identifier/word/:wordNumber" lazy={() => import("/client-new/component/page/edit-word-page")}/>
    <Route path="/notification" lazy={() => import("/client-new/component/page/notification-list-page")}/>
    <Route path="/login" lazy={() => import("/client-new/component/page/login-page")}/>
    <Route path="/register" lazy={() => import("/client-new/component/page/register-page")}/>
  </Route>
), {basename: "/next"});


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