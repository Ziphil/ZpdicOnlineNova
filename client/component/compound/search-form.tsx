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
    parameter: NormalSearchParameter.of({search: "", mode: "both", type: "prefix"})
  };
  public state: State = {
    searchFormOpen: false
  };

  private handleSearchSet(search: string): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.props.parameter;
      let mode = (oldParameter instanceof NormalSearchParameter) ? oldParameter.mode : "both";
      let type = (oldParameter instanceof NormalSearchParameter) ? oldParameter.type : "prefix";
      let parameter = NormalSearchParameter.of({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleModeSet(mode: SearchMode): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.props.parameter;
      let search = (oldParameter instanceof NormalSearchParameter) ? oldParameter.search : "";
      let type = (oldParameter instanceof NormalSearchParameter) ? oldParameter.type : "prefix";
      let parameter = NormalSearchParameter.of({search, mode, type});
      this.props.onParameterSet(parameter);
    }
  }

  private handleTypeSet(type: SearchType): void {
    if (this.props.onParameterSet) {
      let oldParameter = this.props.parameter;
      let search = (oldParameter instanceof NormalSearchParameter) ? oldParameter.search : "";
      let mode = (oldParameter instanceof NormalSearchParameter) ? oldParameter.mode : "both";
      let parameter = NormalSearchParameter.of({search, mode, type});
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
    let parameter = this.props.parameter;
    let search = (parameter instanceof NormalSearchParameter) ? parameter.search : "";
    let mode = (parameter instanceof NormalSearchParameter) ? parameter.mode : "both";
    let type = (parameter instanceof NormalSearchParameter) ? parameter.type : "prefix";
    let node = (
      <Fragment>
        <form styleName="root" onSubmit={(event) => event.preventDefault()}>
          <Input value={search} onSet={this.handleSearchSet.bind(this)}/>
          <div styleName="radio-wrapper">
            <RadioGroup name="mode" value={mode} specs={modeSpecs} onSet={this.handleModeSet.bind(this)}/>
          </div>
          <div styleName="radio-wrapper">
            <RadioGroup name="type" value={type} specs={typeSpecs} onSet={this.handleTypeSet.bind(this)}/>
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