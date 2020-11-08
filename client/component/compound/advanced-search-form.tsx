//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  Suggest
} from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import Selection from "/client/component/atom/selection";
import {
  SuggestionSpec
} from "/client/component/atom/suggestion";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  deleteAt
} from "/client/util/misc";
import {
  ADVANCED_SEARCH_MODES,
  AdvancedSearchParameter,
  AdvancedSearchParameterElement,
  Dictionary,
  SEARCH_TYPES,
  SearchParameter
} from "/server/skeleton/dictionary";


@style(require("./advanced-search-form.scss"))
export default class AdvancedSearchForm extends Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    let parameter = (props.defaultParameter instanceof AdvancedSearchParameter) ? props.defaultParameter : AdvancedSearchParameter.createEmpty();
    this.state = {parameter};
  }

  public componentDidUpdate(previousProps: any): void {
    if (this.props !== previousProps) {
      let parameter = (this.props.defaultParameter instanceof AdvancedSearchParameter) ? this.props.defaultParameter : AdvancedSearchParameter.createEmpty();
      this.setState({parameter});
    }
  }

  private handleClose(event: MouseEvent<HTMLElement>): void {
    if (this.props.onClose) {
      this.props.onClose(event);
    }
  }

  private confirmParameter(event: MouseEvent<HTMLButtonElement>): void {
    let parameter = this.state.parameter;
    if (this.props.onClose) {
      this.props.onClose(event);
    }
    if (this.props.onConfirm) {
      this.props.onConfirm(parameter, event);
    }
  }

  private createSuggest(propertyName: string): Suggest {
    let outerThis = this;
    let number = this.props.dictionary.number;
    let suggest = async function (pattern: string): Promise<Array<SuggestionSpec<string>>> {
      let response = await outerThis.requestGet("suggestDictionaryTitles", {number, propertyName, pattern}, {ignoreError: true});
      if (response.status === 200 && !("error" in response.data)) {
        let titles = response.data;
        let suggestions = titles.map((title) => ({replacement: title, node: title}));
        return suggestions;
      } else {
        return [];
      }
    };
    return suggest;
  }

  private setParameter<T extends Array<unknown>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let parameter = outerThis.state.parameter;
      outerThis.setState({parameter});
    };
    return wrapper;
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let elements = this.state.parameter.elements;
    let modeSpecs = ADVANCED_SEARCH_MODES.map((mode) => ({value: mode, text: this.trans(`advancedSearchForm.${mode}`)}));
    let typeSpecs = SEARCH_TYPES.map((type) => ({value: type, text: this.trans(`advancedSearchForm.${type}`)}));
    let searchNodes = elements.map((element, index) => {
      let modeLabel = (index === 0) ? this.trans("advancedSearchForm.mode") : undefined;
      let typeLabel = (index === 0) ? this.trans("advancedSearchForm.type") : undefined;
      let titleLabel = (index === 0) ? this.trans("advancedSearchForm.title") : undefined;
      let searchLabel = (index === 0) ? this.trans("advancedSearchForm.search") : undefined;
      let titleDisabled = element.mode !== "equivalent" && element.mode !== "information";
      let suggest = (titleDisabled) ? undefined : this.createSuggest(element.mode);
      let searchNode = (
        <div styleName="inner" key={index}>
          <div styleName="form left">
            <Selection className={styles["selection"]} value={element.mode} label={modeLabel} specs={modeSpecs} onSet={this.setParameter((mode) => elements[index].mode = mode)}/>
            <Selection className={styles["selection"]} value={element.type} label={typeLabel} specs={typeSpecs} onSet={this.setParameter((type) => elements[index].type = type)}/>
          </div>
          <div styleName="form right">
            <Input className={styles["title"]} value={element.title} label={titleLabel} suggest={suggest} disabled={titleDisabled} onSet={this.setParameter((title) => elements[index].title = title)}/>
            <Input className={styles["search"]} value={element.search} label={searchLabel} onSet={this.setParameter((search) => elements[index].search = search)}/>
          </div>
          <div styleName="control-button">
            <Button iconLabel="&#xF068;" onClick={this.setParameter(() => deleteAt(elements, index))}/>
          </div>
        </div>
      );
      return searchNode;
    });
    let node = (
      <Overlay size="large" title={this.trans("advancedSearchForm.overlayTitle")} open={this.props.open} onClose={this.handleClose.bind(this)}>
        {searchNodes}
        <div styleName="plus">
          <Button iconLabel="&#xF067;" onClick={this.setParameter(() => elements.push(AdvancedSearchParameterElement.createEmpty()))}/>
        </div>
        <div styleName="confirm-button">
          <Button label={this.trans("advancedSearchForm.confirm")} iconLabel="&#xF00C;" style="information" onClick={this.confirmParameter.bind(this)}/>
        </div>
      </Overlay>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  defaultParameter: SearchParameter,
  open: boolean
  onClose?: (event: MouseEvent<HTMLElement>) => void,
  onConfirm?: (parameter: SearchParameter, event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
  parameter: AdvancedSearchParameter
};