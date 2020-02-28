//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  TopPage
} from "../page/top-page";


export class Root extends Component<{}, {}> {

  public render(): ReactNode {
    return (
      <div className="main">
        <TopPage/>
      </div>
    );
  }

}