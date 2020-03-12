//

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
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom";
import {
  StoreComponent
} from "/client/component/component";
import {
  DashboardPage,
  DictionaryListPage,
  DictionaryPage,
  DictionarySettingPage,
  LoginPage,
  RegisterPage,
  TopPage
} from "/client/component/page";
import {
  GuestRoute,
  PrivateRoute
} from "/client/component/routing/authentication";
import {
  GlobalStore
} from "/client/component/store";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./root.scss"))
export class Root extends StoreComponent<Props, State> {

  private store: GlobalStore = new GlobalStore();
  public state: State = {
    ready: false
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchUserInfo", {}, true);
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
    let node;
    if (this.state.ready) {
      node = (
        <BrowserRouter>
          <Provider store={this.store}>
            <Switch>
              <GuestRoute exact path="/" redirect="/dashboard" component={TopPage}/>
              <GuestRoute exact path="/login" redirect="/dashboard" component={LoginPage}/>
              <GuestRoute exact path="/register" redirect="/dashboard" component={RegisterPage}/>
              <PrivateRoute exact path="/dashboard/:mode" redirect="/login" component={DashboardPage}/>
              <PrivateRoute exact path="/dashboard" redirect="/login" component={DashboardPage}/>
              <Route exact path="/dictionary/list" component={DictionaryListPage}/>
              <Route exact path="/dictionary/:number(\d+)" component={DictionaryPage}/>
              <PrivateRoute exact path="/dictionary/setting/:number(\d+)" redirect="/login" component={DictionarySettingPage}/>
            </Switch>
          </Provider>
        </BrowserRouter>
      );
    }
    return node;
  }

}


type Props = {
};
type State = {
  ready: boolean
};