//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "../util/decorator";


@applyStyle(require("./dashboard-page.scss"))
export class DashboardPage extends Component<{}, {}> {

  public render(): ReactNode {
    return (
      <div styleName="dashboard-page">
        Logged in
      </div>
    );
  }

}