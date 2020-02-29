//

import * as react from "react";
import {
  Component,
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
  DashboardPage
} from "../component/page/dashboard-page";
import {
  TopPage
} from "../component/page/top-page";
import * as http from "../util/http";
import history from "./history";
import {
  Private
} from "./routing/private";


export class Root extends Component<{}, {}> {

  // 認証済みかどうかを確認し、その結果に応じて表示するコンポーネントを切り返るコンポーネントを返します。
  public switch(publicComponent: ComponentType<any>, privateComponent: ComponentType<any>): ComponentType<any> {
    let component = function (props: PropsWithChildren<any>): ReactElement {
      if (http.isAuthenticated()) {
        return react.createElement(privateComponent, props);
      } else {
        return react.createElement(publicComponent, props);
      }
    };
    return component;
  }

  public render(): ReactNode {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={this.switch(TopPage, DashboardPage)}/>
          <Private redirect="/login">
            <Switch>
              <Route exact path="/dashboard" component={DashboardPage}/>
            </Switch>
          </Private>
        </Switch>
      </Router>
    );
  }

}