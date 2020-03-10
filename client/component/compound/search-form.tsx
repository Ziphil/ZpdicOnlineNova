//

import {
  debounce
} from "lodash-es";
import * as react from "react";
import {
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
    mode: "both",
    type: "prefix"
  };

  private handleSearchSet(search: string): void {
    this.setState({search});
    let debounceChange = debounce((innerSearch) => {
      if (this.props.onSearchChange) {
        this.props.onSearchChange(innerSearch);
      }
      if (this.props.onAnyChange) {
        this.props.onAnyChange(innerSearch, this.state.mode, this.state.type);
      }
    }, 500);
    debounceChange(search);
  }

  private handleModeSet(mode: string): void {
    this.setState({mode});
    if (this.props.onModeChange) {
      this.props.onModeChange(mode);
    }
    if (this.props.onAnyChange) {
      this.props.onAnyChange(this.state.search, mode, this.state.type);
    }
  }

  private handleTypeSet(type: string): void {
    this.setState({type});
    if (this.props.onTypeChange) {
      this.props.onTypeChange(type);
    }
    if (this.props.onAnyChange) {
      this.props.onAnyChange(this.state.search, this.state.mode, type);
    }
  }

  public render(): ReactNode {
    let modeSpecs = [
      {value: "both", label: "単語＋訳語"},
      {value: "name", label: "単語"},
      {value: "equivalent", label: "訳語"},
      {value: "content", label: "全文"}
    ];
    let typeSpecs = [
      {value: "prefix", label: "前方"},
      {value: "part", label: "部分"},
      {value: "exact", label: "完全"},
      {value: "regular", label: "正規"}
    ];
    let node = (
      <form styleName="root">
        <Input onSet={this.handleSearchSet.bind(this)}/>
        <div styleName="radio-wrapper">
          <RadioGroup name="mode" initialValue="both" specs={modeSpecs} onSet={this.handleModeSet.bind(this)}/>
          <RadioGroup name="type" initialValue="prefix" specs={typeSpecs} onSet={this.handleTypeSet.bind(this)}/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  onSearchChange?: (search: string) => void;
  onModeChange?: (mode: string) => void;
  onTypeChange?: (type: string) => void;
  onAnyChange?: (search: string, mode: string, type: string) => void;
};
type State = {
  search: string,
  mode: string,
  type: string
};

export let SearchForm = withRouter(SearchFormBase);