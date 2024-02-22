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
    <Route path="/dictionary/:identifier" lazy={() => import("/client-new/component/page/dictionary-page")}>
      <Route index={true} lazy={() => import("/client-new/component/page/dictionary-main-part")}/>
      <Route path="sentences" lazy={() => import("/client-new/component/page/dictionary-example-part")}/>
      <Route path="info" lazy={() => import("/client-new/component/page/dictionary-information-part")}/>
      <Route path="resources" lazy={() => import("/client-new/component/page/dictionary-resource-part")}/>
      <Route path="requests" lazy={() => import("/client-new/component/page/dictionary-commission-part")}/>
      <Route path="settings" lazy={() => import("/client-new/component/page/dictionary-setting-part")}>
        <Route index={true} lazy={() => import("/client-new/component/page/dictionary-setting-general-part")}/>
        <Route path="general" lazy={() => import("/client-new/component/page/dictionary-setting-general-part")}/>
        <Route path="editing" lazy={() => import("/client-new/component/page/dictionary-setting-editing-part")}/>
        <Route path="file" lazy={() => import("/client-new/component/page/dictionary-setting-file-part")}/>
        <Route path="permissions" lazy={() => import("/client-new/component/page/dictionary-setting-authority-part")}/>
      </Route>
    </Route>
    <Route path="/dictionary/:identifier/word/new" lazy={() => import("/client-new/component/page/edit-word-page")}/>
    <Route path="/dictionary/:identifier/word/:wordNumber" lazy={() => import("/client-new/component/page/edit-word-page")}/>
    <Route path="/dictionary/:identifier/example/new" lazy={() => import("/client-new/component/page/edit-example-page")}/>
    <Route path="/dictionary/:identifier/example/:exampleNumber" lazy={() => import("/client-new/component/page/edit-example-page")}/>
    <Route path="/user/:name" lazy={() => import("/client-new/component/page/user-page")}>
      <Route index={true} lazy={() => import("/client-new/component/page/user-dictionary-part")}/>
      <Route path="notifications" lazy={() => import("/client-new/component/page/user-notification-part")}/>
      <Route path="settings" lazy={() => import("/client-new/component/page/user-setting-part")}/>
    </Route>
    <Route path="/notification" lazy={() => import("/client-new/component/page/notification-list-page")}/>
    <Route path="/login" lazy={() => import("/client-new/component/page/login-page")}/>
    <Route path="/register" lazy={() => import("/client-new/component/page/register-page")}/>
    <Route path="/reset" lazy={() => import("/client-new/component/page/reset-user-password-page")}/>
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