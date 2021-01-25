//

import {
  History,
  createBrowserHistory
} from "history";
import {
  Provider
} from "mobx-react";
import * as react from "react";
import {
  ReactNode,
  Suspense,
  lazy
} from "react";
import {
  IntlProvider
} from "react-intl";
import {
  Route,
  Router,
  Switch
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import EmptyPage from "/client/component/page/empty-page";
import ErrorPage from "/client/component/page/error-page";
import {
  GlobalStore
} from "/client/component/store";
import Authenticator from "/client/component/util/authenticator";
import ErrorBoundary from "/client/component/util/error-boundary";
import ScrollTop from "/client/component/util/scroll-top";


require("../../node_modules/codemirror/lib/codemirror.css");
require("../../node_modules/c3/c3.css");

let AddCommissionPage = lazy(() => import("/client/component/page/add-commission-page"));
let ContactPage = lazy(() => import("/client/component/page/contact-page"));
let DashboardPage = lazy(() => import("/client/component/page/dashboard-page"));
let DictionaryListPage = lazy(() => import("/client/component/page/dictionary-list-page"));
let DictionaryPage = lazy(() => import("/client/component/page/dictionary-page"));
let DictionarySettingPage = lazy(() => import("/client/component/page/dictionary-setting-page"));
let DocumentPage = lazy(() => import("/client/component/page/document-page"));
let LanguagePage = lazy(() => import("/client/component/page/language-page"));
let LoginPage = lazy(() => import("/client/component/page/login-page"));
let NotFoundPage = lazy(() => import("/client/component/page/not-found-page"));
let NotificationPage = lazy(() => import("/client/component/page/notification-page"));
let RegisterPage = lazy(() => import("/client/component/page/register-page"));
let ResetUserPasswordPage = lazy(() => import("/client/component/page/reset-user-password-page"));
let TopPage = lazy(() => import("/client/component/page/top-page"));


@style(require("./root.scss"), {withRouter: false, inject: false, injectIntl: false, observer: true})
export class Root extends Component<Props, State> {

  private store: GlobalStore = new GlobalStore();
  private history: History = createBrowserHistory();

  public state: State = {
    ready: false
  };

  public async componentDidMount(): Promise<void> {
    await Promise.all([this.store.fetchUser(), this.store.defaultLocale()]);
    this.setState({ready: true});
  }

  public render(): ReactNode {
    let node = (this.state.ready) && (
      <Router history={this.history}>
        <Provider store={this.store}>
          <IntlProvider defaultLocale="ja" locale={this.store.locale} messages={this.store.messages}>
            <Suspense fallback={<EmptyPage/>}>
              <ErrorBoundary component={ErrorPage}>
                <ScrollTop>
                  <Switch>
                    <Authenticator type="guest" exact sensitive path="/" redirect="/dashboard" component={TopPage}/>
                    <Authenticator type="guest" exact sensitive path="/login" redirect="/dashboard" component={LoginPage}/>
                    <Authenticator type="guest" exact sensitive path="/register" redirect="/dashboard" component={RegisterPage}/>
                    <Authenticator type="guest" exact sensitive path="/reset" redirect="/dashboard" component={ResetUserPasswordPage}/>
                    <Authenticator type="private" exact sensitive path="/dashboard/:mode" redirect="/login" component={DashboardPage}/>
                    <Authenticator type="private" exact sensitive path="/dashboard" redirect="/login" component={DashboardPage}/>
                    <Authenticator type="none" exact sensitive path="/dictionary/:value([a-zA-Z0-9_-]+)" component={DictionaryPage}/>
                    <Authenticator type="none" exact sensitive path="/request/:number(\d+)" component={AddCommissionPage}/>
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
        </Provider>
      </Router>
    );
    return node;
  }

}


type Props = {
};
type State = {
  ready: boolean
};