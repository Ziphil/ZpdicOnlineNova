//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./pagination-button.scss"))
export class PaginationButton extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <Button label="前ページ" position="left" disabled={this.props.previousDisabled} onClick={this.props.onPreviousClicked}/>
        <Button label="次ページ" position="right" disabled={this.props.nextDisabled} onClick={this.props.onNextClicked}/>
      </div>
    );
    return node;
  }

}


type Props = {
  previousDisabled: boolean,
  nextDisabled: boolean,
  onPreviousClicked?: (event: MouseEvent<HTMLButtonElement>) => void,
  onNextClicked?: (event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};