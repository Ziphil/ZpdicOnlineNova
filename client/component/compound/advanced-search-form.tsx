//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  SearchParameter
} from "/server/skeleton/dictionary";


@style(require("./advanced-search-form.scss"))
export default class AdvancedSearchForm extends Component<Props, State> {

  private handleClose(event: MouseEvent<HTMLElement>): void {
    if (this.props.onClose) {
      this.props.onClose(event);
    }
  }

  public render(): ReactNode {
    let node = (
      <Overlay size="large" title={this.trans("advancedSearchForm.title")} open={this.props.open} onClose={this.handleClose.bind(this)}>
        Not yet implemented
      </Overlay>
    );
    return node;
  }

}


type Props = {
  open: boolean
  onClose?: (event: MouseEvent<HTMLElement>) => void,
  onSubmit?: (parameter: SearchParameter, event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};