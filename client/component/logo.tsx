//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
let styles = require("./logo.scss");


export class Logo extends Component {

  public render(): ReactNode {
    return (
      <div className={styles.logo}>
        <div className={styles.title}>ZpDIC</div>
        <div className={styles.subtitle}>Online</div>
        <div className={styles.version}>ver 0.0.0</div>
      </div>
    );
  }

}