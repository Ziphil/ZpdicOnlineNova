//

import {ReactElement} from "react";
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom";
import {create} from "/client-new/component/create";
import {ErrorPage} from "/client-new/component/page/error-page";
import {ToplevelRoute} from "./toplevel-route";


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<ToplevelRoute/>} errorElement={<ErrorPage/>}>
    <Route path="/" lazy={() => import("/client-new/component/page/top-page")}/>
    <Route path="/dictionary" lazy={() => import("/client-new/component/page/dictionary-list-page")}/>
    <Route path="/dictionary/:identifier" lazy={() => import("/client-new/component/page/dictionary-page")}/>
    <Route path="/dictionary/:identifier/sentences" lazy={() => import("/client-new/component/page/example-page")}/>
    <Route path="/dictionary/:identifier/info" lazy={() => import("/client-new/component/page/dictionary-information-page")}/>
    <Route path="/dictionary/:identifier/requests" lazy={() => import("/client-new/component/page/dictionary-commission-page")}/>
    <Route path="/dictionary/:identifier/settings" lazy={() => import("/client-new/component/page/dictionary-setting-page")}>
      <Route index={true} lazy={() => import("/client-new/component/page/dictionary-setting-general-part")}/>
      <Route path="general" lazy={() => import("/client-new/component/page/dictionary-setting-general-part")}/>
      <Route path="editing" lazy={() => import("/client-new/component/page/dictionary-setting-editing-part")}/>
      <Route path="permissions" lazy={() => import("/client-new/component/page/dictionary-setting-authority-part")}/>
    </Route>
    <Route path="/dictionary/:identifier/word/new" lazy={() => import("/client-new/component/page/add-word-page")}/>
    <Route path="/dictionary/:identifier/word/:wordNumber" lazy={() => import("/client-new/component/page/edit-word-page")}/>
    <Route path="/user/:name" lazy={() => import("/client-new/component/page/user-page")}/>
    <Route path="/user/:name/notifications" lazy={() => import("/client-new/component/page/user-notification-page")}/>
    <Route path="/user/:name/settings" lazy={() => import("/client-new/component/page/user-setting-page")}/>
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
      <RouterProvider router={router}/>
    );

  }
);