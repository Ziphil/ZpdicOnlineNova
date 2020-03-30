//

import * as react from "react";
import {
  render
} from "react-dom";
import {
  Root
} from "/client/component/root";


export const TITLES = ["ZpDIC", "Online"];
export const VERSION = "2.1.0";


class Main {

  public main(): void {
    this.render();
  }

  private render(): void {
    render(<Root/>, document.getElementById("root"));
  }

}


let main = new Main();
main.main();