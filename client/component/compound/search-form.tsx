//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Input,
  RadioGroup
} from "/client/component/atom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./search-form.scss"))
class SearchFormBase extends ComponentBase<Props, State> {

  public state: State = {
    search: "",
    searchMode: "both",
    searchType: "prefix"
  };

  private handleSearchChange(search: string): void {
    this.setState({search});
    if (this.props.onSearchChange) {
      this.props.onSearchChange(search);
    }
    if (this.props.onAnyChange) {
      this.props.onAnyChange(search, this.state.searchMode, this.state.searchType);
    }
  }

  private handleSearchModeChange(searchMode: string): void {
    this.setState({searchMode});
    if (this.props.onSearchModeChange) {
      this.props.onSearchModeChange(searchMode);
    }
    if (this.props.onAnyChange) {
      this.props.onAnyChange(this.state.search, searchMode, this.state.searchType);
    }
  }

  private handleSearchTypeChange(searchType: string): void {
    this.setState({searchType});
    if (this.props.onSearchTypeChange) {
      this.props.onSearchTypeChange(searchType);
    }
    if (this.props.onAnyChange) {
      this.props.onAnyChange(this.state.search, this.state.searchMode, searchType);
    }
  }

  public render(): ReactNode {
    let searchModeSpecs = [
      {value: "both", label: "単語＋訳語"},
      {value: "name", label: "単語"},
      {value: "equivalent", label: "訳語"},
      {value: "content", label: "全文"}
    ];
    let searchTypeSpecs = [
      {value: "prefix", label: "前方一致"},
      {value: "part", label: "部分一致"}
    ];
    let node = (
      <form styleName="search">
        <Input onValueChange={this.handleSearchChange.bind(this)}/>
        <div styleName="radio-wrapper">
          <RadioGroup name="mode" initialValue="both" specs={searchModeSpecs} onValueChange={this.handleSearchModeChange.bind(this)}/>
          <RadioGroup name="type" initialValue="prefix" specs={searchTypeSpecs} onValueChange={this.handleSearchTypeChange.bind(this)}/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  onSearchChange?: (search: string) => void;
  onSearchModeChange?: (searchMode: string) => void;
  onSearchTypeChange?: (searchType: string) => void;
  onAnyChange?: (search: string, searchMode: string, searchType: string) => void;
};
type State = {
  search: string,
  searchMode: string,
  searchType: string
};

export let SearchForm = withRouter(SearchFormBase);