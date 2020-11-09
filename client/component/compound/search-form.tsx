//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import Component from "/client/component/component";
import AdvancedSearchForm from "/client/component/compound/advanced-search-form";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary,
  NormalWordParameter,
  WordMode,
  WordParameter,
  WordType
} from "/client/skeleton/dictionary";


@style(require("./search-form.scss"))
export default class SearchForm extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    parameter: NormalWordParameter.createEmpty(),
    showAdvancedSearch: false
  };
  public state: State = {
    searchFormOpen: false
  };

  private getNormalSearchParameter(): NormalWordParameter {
    let parameter = this.props.parameter;
    if (parameter instanceof NormalWordParameter) {
      return parameter;
    } else {
      return NormalWordParameter.createEmpty();
    }
  }

  private handleSearchSet(search: string): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalSearchParameter();
      let mode = oldParameter.mode;
      let type = oldParameter.type;
      let parameter = NormalWordParameter.createEmpty({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleModeSet(mode: WordMode): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalSearchParameter();
      let search = oldParameter.search;
      let type = oldParameter.type;
      let parameter = NormalWordParameter.createEmpty({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleTypeSet(type: WordType): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalSearchParameter();
      let search = oldParameter.search;
      let mode = oldParameter.mode;
      let parameter = NormalWordParameter.createEmpty({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleAdvancedSearchConfirm(parameter: WordParameter): void {
    if (this.props.onParameterSet) {
      this.props.onParameterSet(parameter);
    }
  }

  public render(): ReactNode {
    let modeSpecs = [
      {value: "both", label: this.trans("searchForm.both")},
      {value: "name", label: this.trans("searchForm.name")},
      {value: "equivalent", label: this.trans("searchForm.equivalent")},
      {value: "content", label: this.trans("searchForm.content")}
    ] as const;
    let typeSpecs = [
      {value: "prefix", label: this.trans("searchForm.prefix")},
      {value: "part", label: this.trans("searchForm.part")},
      {value: "exact", label: this.trans("searchForm.exact")},
      {value: "regular", label: this.trans("searchForm.regular")}
    ] as const;
    let parameter = this.getNormalSearchParameter();
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
          <Input value={parameter.search} prefix={<div styleName="icon"/>} onSet={this.handleSearchSet.bind(this)}/>
          <div styleName="radio-wrapper">
            <RadioGroup name="mode" value={parameter.mode} specs={modeSpecs} onSet={this.handleModeSet.bind(this)}/>
          </div>
          <div styleName="radio-wrapper">
            <RadioGroup name="type" value={parameter.type} specs={typeSpecs} onSet={this.handleTypeSet.bind(this)}/>
          </div>
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
  showAdvancedSearch: boolean,
  onParameterSet?: (parameter: WordParameter) => void;
};
type DefaultProps = {
  parameter: WordParameter,
  showAdvancedSearch: boolean
};
type State = {
  searchFormOpen: boolean
};