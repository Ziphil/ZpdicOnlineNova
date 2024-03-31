//

import {ReactElement} from "react";
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom";
import {create} from "/client/component/create";
import {ErrorPage} from "/client/component/page/error-page";
import {ToplevelRoute} from "./toplevel-route";


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<ToplevelRoute/>} errorElement={<ErrorPage/>}>
    <Route path="/" lazy={() => import("/client/component/page/top-page")}/>
    <Route path="/dictionary" lazy={() => import("/client/component/page/dictionary-list-page")}/>
    <Route path="/dictionary/:identifier" lazy={() => import("/client/component/page/dictionary-page")}>
      <Route index={true} lazy={() => import("/client/component/page/dictionary-main-part")}/>
      <Route path="sentences" lazy={() => import("/client/component/page/dictionary-example-part")}/>
      <Route path="info" lazy={() => import("/client/component/page/dictionary-information-part")}/>
      <Route path="resources" lazy={() => import("/client/component/page/dictionary-resource-part")}/>
      <Route path="requests" lazy={() => import("/client/component/page/dictionary-commission-part")}/>
      <Route path="settings" lazy={() => import("/client/component/page/dictionary-setting-part")}>
        <Route index={true} lazy={() => import("/client/component/page/dictionary-setting-general-part")}/>
        <Route path="general" lazy={() => import("/client/component/page/dictionary-setting-general-part")}/>
        <Route path="editing" lazy={() => import("/client/component/page/dictionary-setting-editing-part")}/>
        <Route path="file" lazy={() => import("/client/component/page/dictionary-setting-file-part")}/>
        <Route path="permissions" lazy={() => import("/client/component/page/dictionary-setting-authority-part")}/>
      </Route>
    </Route>
    <Route path="/dictionary/:identifier/word/new" lazy={() => import("/client/component/page/edit-word-page")}/>
    <Route path="/dictionary/:identifier/word/:wordNumber" lazy={() => import("/client/component/page/edit-word-page")}/>
    <Route path="/dictionary/:identifier/example/new" lazy={() => import("/client/component/page/edit-example-page")}/>
    <Route path="/dictionary/:identifier/example/:exampleNumber" lazy={() => import("/client/component/page/edit-example-page")}/>
    <Route path="/user/:name" lazy={() => import("/client/component/page/user-page")}>
      <Route index={true} lazy={() => import("/client/component/page/user-dictionary-part")}/>
      <Route path="notifications" lazy={() => import("/client/component/page/user-notification-part")}/>
      <Route path="settings" lazy={() => import("/client/component/page/user-setting-part")}/>
    </Route>
    <Route path="/sentence" lazy={() => import("/client/component/page/example-offer-list-page")}/>
    <Route path="/notification" lazy={() => import("/client/component/page/notification-list-page")}/>
    <Route path="/contact" lazy={() => import("/client/component/page/contact-page")}/>
    <Route path="/document/*" lazy={() => import("/client/component/page/document-page")}/>
    <Route path="/login" lazy={() => import("/client/component/page/login-page")}/>
    <Route path="/register" lazy={() => import("/client/component/page/register-page")}/>
    <Route path="/reset" lazy={() => import("/client/component/page/reset-user-password-page")}/>
    <Route path="/activate" lazy={() => import("/client/component/page/activate-me-page")}/>
  </Route>
));


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