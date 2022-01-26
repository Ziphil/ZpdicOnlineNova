//

import * as react from "react";
import {
  ReactElement,
  StrictMode,
  Suspense,
  lazy,
  useCallback
} from "react";
import {
  ErrorBoundary
} from "react-error-boundary";
import {
  IntlProvider
} from "react-intl";
import {
  BrowserRouter,
  Switch
} from "react-router-dom";
import {
  create
} from "/client/component/create";
import {
  useDefaultLocale,
  useDefaultUser
} from "/client/component/hook";
import EmptyPage from "/client/component/page/empty-page";
import ErrorPage from "/client/component/page/error-page";
import NotFoundPage from "/client/component/page/not-found-page";
import Authenticator from "/client/component/util/authenticator";
import ScrollTop from "/client/component/util/scroll-top";


require("../../node_modules/codemirror/lib/codemirror.css");
require("../../node_modules/c3/c3.css");

let ActivateUserPage = lazy(() => import("/client/component/page/activate-user-page"));
let ContactPage = lazy(() => import("/client/component/page/contact-page"));
let DashboardPage = lazy(() => import("/client/component/page/dashboard-page"));
let DictionaryListPage = lazy(() => import("/client/component/page/dictionary-list-page"));
let DictionaryPage = lazy(() => import("/client/component/page/dictionary-page"));
let DictionarySettingPage = lazy(() => import("/client/component/page/dictionary-setting-page"));
let DocumentPage = lazy(() => import("/client/component/page/document-page"));
let LanguagePage = lazy(() => import("/client/component/page/language-page"));
let LoginPage = lazy(() => import("/client/component/page/login-page"));
let NotificationPage = lazy(() => import("/client/component/page/notification-page"));
let RegisterPage = lazy(() => import("/client/component/page/register-page"));
let ResetUserPasswordPage = lazy(() => import("/client/component/page/reset-user-password-page"));
let TopPage = lazy(() => import("/client/component/page/top-page"));


const Root = create(
  require("./root.scss"), "Root",
  function ({
  }: {
  }): ReactElement | null {

    let {ready} = useDefaultUser();
    let {locale, messages} = useDefaultLocale("ja");

    let handleIntlError = useCallback(function (error: Error): void {
      console.error(error.name);
    }, []);

    let node = (ready) && (
      <BrowserRouter>
        <IntlProvider defaultLocale="ja" locale={locale} messages={messages} onError={handleIntlError}>
          <Suspense fallback={<EmptyPage/>}>
            <ErrorBoundary fallbackRender={(props) => <ErrorPage {...props}/>}>
              <ScrollTop>
                <Switch>
                  <Authenticator type="none" exact sensitive path="/" component={TopPage}/>
                  <Authenticator type="guest" exact sensitive path="/login" redirect="/dashboard" component={LoginPage}/>
                  <Authenticator type="guest" exact sensitive path="/register" redirect="/dashboard" component={RegisterPage}/>
                  <Authenticator type="guest" exact sensitive path="/reset" redirect="/dashboard" component={ResetUserPasswordPage}/>
                  <Authenticator type="none" exact sensitive path="/activate" component={ActivateUserPage}/>
                  <Authenticator type="private" exact sensitive path="/dashboard/:mode" redirect="/login" component={DashboardPage}/>
                  <Authenticator type="private" exact sensitive path="/dashboard" redirect="/login" component={DashboardPage}/>
                  <Authenticator type="none" exact sensitive path="/dictionary/:value([a-zA-Z0-9_-]+)" component={DictionaryPage}/>
                  <Authenticator type="private" exact sensitive path="/dashboard/dictionary/:mode/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
                  <Authenticator type="private" exact sensitive path="/dashboard/dictionary/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
                  <Authenticator type="none" exact sensitive path="/list" component={DictionaryListPage}/>
                  <Authenticator type="none" exact sensitive path="/notification" component={NotificationPage}/>
                  <Authenticator type="none" exact sensitive path="/contact" component={ContactPage}/>
                  <Authenticator type="none" exact sensitive path="/document/:firstPath?/:secondPath?" component={DocumentPage}/>
                  <Authenticator type="none" exact sensitive path="/language" component={LanguagePage}/>
                  <Authenticator type="none" component={NotFoundPage}/>
                </Switch>
              </ScrollTop>
            </ErrorBoundary>
          </Suspense>
        </IntlProvider>
      </BrowserRouter>
    );
    return node || null;

  }
);


export default Root;