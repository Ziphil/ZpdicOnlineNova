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
  ComponentType,
  PropsWithChildren,
  ReactElement,
  ReactNode
} from "react";
import {
  Route,
  Router,
  Switch
} from "react-router-dom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle
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

  // 認証済みかどうかを確認し、その結果に応じて表示するコンポーネントを切り返るコンポーネントを返します。
  private switch(guestComponent: ComponentType<any>, privateComponent: ComponentType<any>): ComponentType<any> {
    let outerThis = this;
    let component = function (props: PropsWithChildren<any>): ReactElement {
      if (outerThis.store.user) {
        return react.createElement(privateComponent, props);
      } else {
        return react.createElement(guestComponent, props);
      }
    };
    return component;
  }

  public render(): ReactNode {
    let node = (this.state.ready) && (
      <Router history={this.history}>
        <Provider store={this.store}>
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