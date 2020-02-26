//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";


export class Logo extends Component {

  public render(): ReactNode {
    return (
      <div className="logo">
        <div className="title">ZpDIC</div>
        <div className="subtitle">Online</div>
        <div className="version">ver 0.0.0</div>
      </div>
    );
  }

}