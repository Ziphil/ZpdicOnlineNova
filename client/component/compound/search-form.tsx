//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import Selection from "/client/component/atom/selection";
import Component from "/client/component/component";
import AdvancedSearchForm from "/client/component/compound/advanced-search-form";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary,
  NormalWordParameter,
  WORD_ORDER_DIRECTIONS,
  WordMode,
  WordOrderDirection,
  WordOrderMode,
  WordParameter,
  WordType
} from "/client/skeleton/dictionary";


@style(require("./search-form.scss"))
export default class SearchForm extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    parameter: NormalWordParameter.createEmpty(),
    showOrder: false,
    showAdvancedSearch: false
  };
  public state: State = {
    searchFormOpen: false
  };

  private getNormalWordParameter(): NormalWordParameter {
    let parameter = this.props.parameter;
    if (parameter instanceof NormalWordParameter) {
      return parameter;
    } else {
      return NormalWordParameter.createEmpty();
    }
  }

  private handleParameterSet(nextParameter: {search?: string, mode?: WordMode, type?: WordType, orderMode?: WordOrderMode, orderDirection?: WordOrderDirection}): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalWordParameter();
      let search = nextParameter.search ?? oldParameter.search;
      let mode = nextParameter.mode ?? oldParameter.mode;
      let type = nextParameter.type ?? oldParameter.type;
      let orderMode = nextParameter.orderMode ?? oldParameter.order.mode;
      let orderDirection = nextParameter.orderDirection ?? oldParameter.order.direction;
      let order = {mode: orderMode, direction: orderDirection};
      let parameter = NormalWordParameter.createEmpty({search, mode, type, order});
      this.props.onParameterSet(parameter);
    }
  }

  private handleAdvancedSearchConfirm(parameter: WordParameter): void {
    if (this.props.onParameterSet) {
      this.props.onParameterSet(parameter);
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let modes = ["both", "name", "equivalent", "content"] as const;
    let types = ["prefix", "part", "exact", "regular"] as const;
    let orderMode = ["unicode", "updatedDate", "createdDate"] as const;
    let modeSpecs = modes.map((mode) => ({value: mode, label: this.trans(`searchForm.${mode}`)}));
    let typeSpecs = types.map((type) => ({value: type, label: this.trans(`searchForm.${type}`)}));
    let orderModeSpecs = orderMode.map((orderMode) => ({value: orderMode, text: this.trans(`searchForm.${orderMode}`)}));
    let orderDirectionSpecs = WORD_ORDER_DIRECTIONS.map((orderDirection) => ({value: orderDirection, text: this.trans(`searchForm.${orderDirection}`)}));
    let parameter = this.getNormalWordParameter();
    let orderNode = (this.props.showOrder) && (
      <div styleName="selection-wrapper">
        <Selection className={styles["order-mode"]} value={parameter.order.mode} specs={orderModeSpecs} onSet={(orderMode) => this.handleParameterSet({orderMode})}/>
        <Selection className={styles["order-direction"]} value={parameter.order.direction} specs={orderDirectionSpecs} onSet={(orderDirection) => this.handleParameterSet({orderDirection})}/>
      </div>
    );
    let advancedSearchButton = (this.props.showAdvancedSearch) && (
      <div styleName="radio-wrapper">
        <Button label={this.trans("searchForm.advancedSearch")} iconLabel="&#xF00E;" style="simple" onClick={() => this.setState({searchFormOpen: true})}/>
      </div>
    );
    let advancedSearchNode = (this.props.showAdvancedSearch) && (
      <AdvancedSearchForm
        dictionary={this.props.dictionary}
        defaultParameter={this.props.parameter}
        open={this.state.searchFormOpen}
        onConfirm={this.handleAdvancedSearchConfirm.bind(this)}
        onClose={() => this.setState({searchFormOpen: false})}
      />
    );
    let node = (
      <Fragment>
        <form styleName="root" onSubmit={(event) => event.preventDefault()}>
          <Input value={parameter.search} prefix={<div styleName="icon"/>} onSet={(search) => this.handleParameterSet({search})}/>
          <div styleName="radio-wrapper">
            <RadioGroup name="mode" value={parameter.mode} specs={modeSpecs} onSet={(mode) => this.handleParameterSet({mode})}/>
          </div>
          <div styleName="radio-wrapper">
            <RadioGroup name="type" value={parameter.type} specs={typeSpecs} onSet={(type) => this.handleParameterSet({type})}/>
          </div>
          {orderNode}
          {advancedSearchButton}
        </form>
        {advancedSearchNode}
      </Fragment>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  parameter: WordParameter,
  showOrder: boolean,
  showAdvancedSearch: boolean,
  onParameterSet?: (parameter: WordParameter) => void;
};
type DefaultProps = {
  parameter: WordParameter,
  showOrder: boolean,
  showAdvancedSearch: boolean
};
type State = {
  searchFormOpen: boolean
};