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
  deleteAt
} from "/client/util/misc";
import {
  AdvancedSearchParameter,
  AdvancedSearchParameterElement,
  SEARCH_MODES,
  SEARCH_TYPES,
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

  private setParameter<T extends Array<any>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let parameter = outerThis.state.parameter;
      outerThis.setState({parameter});
    };
    return wrapper;
  }

  public render(): ReactNode {
    let parameter = this.state.parameter;
    let searchNodes = this.state.parameter.elements.map((element, index) => {
      let modeSpecs = SEARCH_MODES.map((mode) => ({value: mode, text: this.trans(`advancedSearchForm.${mode}`)}));
      let typeSpecs = SEARCH_TYPES.map((type) => ({value: type, text: this.trans(`advancedSearchForm.${type}`)}));
      let modeLabel = (index === 0) ? this.trans("advancedSearchForm.mode") : undefined;
      let titleLabel = (index === 0) ? this.trans("advancedSearchForm.title") : undefined;
      let searchLabel = (index === 0) ? this.trans("advancedSearchForm.search") : undefined;
      let typeLabel = (index === 0) ? this.trans("advancedSearchForm.type") : undefined;
      let searchNode = (
        <div styleName="inner" key={index}>
          <div styleName="form">
            <Selection value={element.mode} label={modeLabel} specs={modeSpecs}/>
            <Input value={element.title} label={titleLabel}/>
            <Input value={element.search} label={searchLabel}/>
            <Selection value={element.type} label={typeLabel} specs={typeSpecs}/>
          </div>
          <div styleName="button">
            <Button iconLabel="&#xF00D;" onClick={this.setParameter(() => deleteAt(parameter.elements, index))}/>
          </div>
        </div>
      );
      return searchNode;
    });
    let node = (
      <Overlay size="large" title={this.trans("advancedSearchForm.overlayTitle")} open={this.props.open} onClose={this.handleClose.bind(this)}>
        {searchNodes}
        <div styleName="plus">
          <Button iconLabel="&#xF067;" onClick={this.setParameter(() => parameter.elements.push(AdvancedSearchParameterElement.createEmpty()))}/>
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