//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  LoginForm
} from "./login-form";
import {
  Logo
} from "./logo";


export class TopPage extends Component {

  public render(): ReactNode {
    return (
      <div className="top-page">
        <div className="logo-wrapper">
          <Logo/>
          <LoginForm/>
        </div>
      </div>
    );
  }

}