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
import {
  GuestRoute,
  PrivateRoute
} from "/client/component/routing/authentication";
import {
  GlobalStore
} from "/client/component/store";


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
              <Switch>
                <GuestRoute exact sensitive path="/" redirect="/dashboard" component={TopPage}/>
                <GuestRoute exact sensitive path="/login" redirect="/dashboard" component={LoginPage}/>
                <GuestRoute exact sensitive path="/register" redirect="/dashboard" component={RegisterPage}/>
                <GuestRoute exact sensitive path="/reset" redirect="/dashboard" component={ResetUserPasswordPage}/>
                <PrivateRoute exact sensitive path="/dashboard/:mode" redirect="/login" component={DashboardPage}/>
                <PrivateRoute exact sensitive path="/dashboard" redirect="/login" component={DashboardPage}/>
                <Route exact sensitive path="/dictionary/:value([a-zA-Z0-9_-]+)" component={DictionaryPage}/>
                <Route exact sensitive path="/request/:number(\d+)" component={AddCommissionPage}/>
                <PrivateRoute exact sensitive path="/dashboard/dictionary/:mode/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
                <PrivateRoute exact sensitive path="/dashboard/dictionary/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
                <Route exact sensitive path="/list" component={DictionaryListPage}/>
                <Route exact sensitive path="/notification" component={NotificationPage}/>
                <Route exact sensitive path="/contact" component={ContactPage}/>
                <Route exact sensitive path="/document/:firstPath?/:secondPath?" component={DocumentPage}/>
                <Route exact sensitive path="/language" component={LanguagePage}/>
              </Switch>
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