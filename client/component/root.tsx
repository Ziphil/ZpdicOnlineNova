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
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  observer
} from "/client/component/decorator";
import {
  EmptyPage
} from "/client/component/page/empty-page";
import {
  GuestRoute,
  PrivateRoute
} from "/client/component/routing/authentication";
import {
  GlobalStore
} from "/client/component/store";


let ContactPage = lazy(() => import("/client/component/page/contact-page"));
let DashboardPage = lazy(() => import("/client/component/page/dashboard-page"));
let DictionaryListPage = lazy(() => import("/client/component/page/dictionary-list-page"));
let DictionaryPage = lazy(() => import("/client/component/page/dictionary-page"));
let DictionarySettingPage = lazy(() => import("/client/component/page/dictionary-setting-page"));
let LoginPage = lazy(() => import("/client/component/page/login-page"));
let NotificationPage = lazy(() => import("/client/component/page/notification-page"));
let RegisterPage = lazy(() => import("/client/component/page/register-page"));
let ResetUserPasswordPage = lazy(() => import("/client/component/page/reset-user-password-page"));
let TopPage = lazy(() => import("/client/component/page/top-page"));


@observer
@applyStyle(require("./root.scss"))
export class Root extends StoreComponent<Props, State> {

  private store: GlobalStore = new GlobalStore();
  private history: History = createBrowserHistory();

  public state: State = {
    ready: false
  };

  public async componentDidMount(): Promise<void> {
    await this.store.fetchUser();
    this.setState({ready: true});
  }

  private getMessages(): Record<string, string> {
    let locale = this.store.locale;
    if (locale === "ja") {
      return require("../language/ja.yml");
    } else if (locale === "en") {
      return require("../language/en.yml");
    } else {
      return require("../language/ja.yml");
    }
  }

  public render(): ReactNode {
    let messages = this.getMessages();
    let node = (this.state.ready) && (
      <Router history={this.history}>
        <Provider store={this.store}>
          <IntlProvider defaultLocale="ja" locale={this.store.locale} messages={messages}>
            <Suspense fallback={EmptyPage}>
              <Switch>
                <GuestRoute exact path="/" redirect="/dashboard" component={TopPage}/>
                <GuestRoute exact path="/login" redirect="/dashboard" component={LoginPage}/>
                <GuestRoute exact path="/register" redirect="/dashboard" component={RegisterPage}/>
                <GuestRoute exact path="/reset" redirect="/dashboard" component={ResetUserPasswordPage}/>
                <PrivateRoute exact path="/dashboard/:mode" redirect="/login" component={DashboardPage}/>
                <PrivateRoute exact path="/dashboard" redirect="/login" component={DashboardPage}/>
                <Route exact path="/dictionary/:value([a-zA-Z0-9_-]+)" component={DictionaryPage}/>
                <PrivateRoute exact path="/dashboard/dictionary/:mode/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
                <PrivateRoute exact path="/dashboard/dictionary/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
                <Route exact path="/list" component={DictionaryListPage}/>
                <Route exact path="/notification" component={NotificationPage}/>
                <Route exact path="/contact" component={ContactPage}/>
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