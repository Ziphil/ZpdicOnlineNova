//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  InformationPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  getMessage
} from "/client/component/message";


@applyStyle(require("./form-pane.scss"))
export class FormPane extends Component<Props, State> {

  public static defaultProps: Props = {
    errorType: null
  };

  public render(): ReactNode {
    let errorType = this.props.errorType;
    let errorNode = (errorType !== null) && (
      <div styleName="error">
        <InformationPane texts={[getMessage(errorType)]} style="error" onClose={this.props.onErrorClose}/>
      </div>
    );
    let node = (
      <div>
        {errorNode}
        <div styleName="root">
          {this.props.children}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  errorType: string | null,
  onErrorClose?: (event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};