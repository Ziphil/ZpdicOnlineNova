//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";
import {
  LoginForm
} from "./login-form";
import {
  Logo
} from "./logo";
let styles = require("./top-page.scss");


@css(styles)
export class TopPage extends Component {

  public render(): ReactNode {
    return (
      <div styleName="top-page">
        <div styleName="logo-wrapper">
          <Logo/>
          <LoginForm/>
        </div>
      </div>
    );
  }

}