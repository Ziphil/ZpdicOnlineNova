//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import Selection from "/client/component/atom/selection";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  AdvancedSearchParameter,
  SEARCH_MODES,
  SearchParameter
} from "/server/skeleton/dictionary";


@style(require("./advanced-search-form.scss"))
export default class AdvancedSearchForm extends Component<Props, State> {

  public state: State = {
    parameter: {elements: []}
  };

  private handleClose(event: MouseEvent<HTMLElement>): void {
    if (this.props.onClose) {
      this.props.onClose(event);
    }
  }

  public render(): ReactNode {
    let searchNodes = this.state.parameter.elements.map((element, index) => {
      let modeSpecs = SEARCH_MODES.map((mode) => ({value: mode, text: this.trans(`advancedSearchForm.${mode}`)}));
      let searchNode = (
        <div styleName="form" key={index}>
          <Selection value={element.mode} label={this.trans("advancedSearchForm.mode")} specs={modeSpecs}/>
        </div>
      );
      return searchNode;
    });
    let node = (
      <Overlay size="large" title={this.trans("advancedSearchForm.title")} open={this.props.open} onClose={this.handleClose.bind(this)}>
        {searchNodes}
        <div styleName="plus">
          <Button iconLabel="&#xF067;"/>
        </div>
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
  parameter: AdvancedSearchParameter
};