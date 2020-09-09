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
  ReactNode
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
  inject,
  observer
} from "/client/component/decorator";
import {
  DashboardPage,
  DictionaryListPage,
  DictionaryPage,
  DictionarySettingPage,
  LoginPage,
  NotificationPage,
  RegisterPage,
  ResetUserPasswordPage,
  TopPage
} from "/client/component/page";
import {
  GuestRoute,
  PrivateRoute
} from "/client/component/routing/authentication";
import {
  GlobalStore
} from "/client/component/store";


@observer
@applyStyle(require("./root.scss"))
export class Root extends StoreComponent<Props, State> {

  private store: GlobalStore = new GlobalStore();
  private history: History = createBrowserHistory();

  public state: State = {
    ready: false
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchUser", {}, true);
    if (response.status === 200) {
      let user = response.data;
      this.store.user = user;
    } else {
      this.store.user = null;
    }
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
            <Switch>
              <GuestRoute exact path="/" redirect="/dashboard" component={TopPage}/>
              <GuestRoute exact path="/login" redirect="/dashboard" component={LoginPage}/>
              <GuestRoute exact path="/register" redirect="/dashboard" component={RegisterPage}/>
              <GuestRoute exact path="/reset" redirect="/dashboard" component={ResetUserPasswordPage}/>
              <PrivateRoute exact path="/dashboard/:mode" redirect="/login" component={DashboardPage}/>
              <PrivateRoute exact path="/dashboard" redirect="/login" component={DashboardPage}/>
              <Route exact path="/dictionary/:value([a-zA-Z0-9_-]+)" component={DictionaryPage}/>
              <PrivateRoute exact path="/dictionary-setting/:mode/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
              <PrivateRoute exact path="/dictionary-setting/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
              <Route exact path="/list" component={DictionaryListPage}/>
              <Route exact path="/news" component={NotificationPage}/>
            </Switch>
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