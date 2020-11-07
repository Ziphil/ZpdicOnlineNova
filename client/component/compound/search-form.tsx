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
  NormalSearchParameter,
  SearchMode,
  SearchParameter,
  SearchType
} from "/server/skeleton/dictionary";


@style(require("./search-form.scss"))
export default class SearchForm extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    parameter: NormalSearchParameter.createEmpty()
  };
  public state: State = {
    searchFormOpen: false
  };

  private getNormalSearchParameter(): NormalSearchParameter {
    let parameter = this.props.parameter;
    if (parameter instanceof NormalSearchParameter) {
      return parameter;
    } else {
      return NormalSearchParameter.createEmpty();
    }
  }

  private handleSearchSet(search: string): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalSearchParameter();
      let mode = oldParameter.mode;
      let type = oldParameter.type;
      let parameter = NormalSearchParameter.createEmpty({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleModeSet(mode: SearchMode): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalSearchParameter();
      let search = oldParameter.search;
      let type = oldParameter.type;
      let parameter = NormalSearchParameter.createEmpty({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleTypeSet(type: SearchType): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.getNormalSearchParameter();
      let search = oldParameter.search;
      let mode = oldParameter.mode;
      let parameter = NormalSearchParameter.createEmpty({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleAdvancedSearchConfirm(parameter: SearchParameter): void {
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
          <div styleName="radio-wrapper">
            <Button label={this.trans("searchForm.advancedSearch")} style="link" onClick={() => this.setState({searchFormOpen: true})}/>
          </div>
        </form>
        <AdvancedSearchForm open={this.state.searchFormOpen} onConfirm={this.handleAdvancedSearchConfirm.bind(this)} onClose={() => this.setState({searchFormOpen: false})}/>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  parameter: SearchParameter,
  onParameterSet?: (parameter: SearchParameter) => void;
};
type DefaultProps = {
  parameter: SearchParameter
};
type State = {
  searchFormOpen: boolean
};