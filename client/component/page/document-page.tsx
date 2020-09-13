//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";


export class DocumentPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div id="page">
        <div>
          Dummy document.
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};