//

import {
  debounce,
  throttle
} from "lodash-es";
import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Input,
  RadioGroup
} from "/client/component/atom";
import {
  applyStyle
} from "/client/component/decorator";
import {
  SearchMode,
  SearchType
} from "/server/model/dictionary/search-parameter";


@applyStyle(require("./search-form.scss"))
export class SearchForm extends Component<Props, State> {

  public state: State = {
    search: "",
    mode: "both",
    type: "prefix"
  };

  public constructor(props: Props) {
    super(props);
    let search = this.props.initialSearch || "";
    let mode = this.props.initialMode || "both";
    let type = this.props.initialType || "prefix";
    this.state = {search, mode, type};
  }

  private handleSearchSet(search: string): void {
    this.setState({search});
    let debounceChange = debounce((innerSearch) => {
      if (this.props.onSearchSet) {
        this.props.onSearchSet(innerSearch);
      }
      if (this.props.onAnySet) {
        this.props.onAnySet(innerSearch, this.state.mode, this.state.type);
      }
    }, 500);
    debounceChange(search);
  }

  private handleModeSet(mode: SearchMode): void {
    this.setState({mode});
    if (this.props.onModeSet) {
      this.props.onModeSet(mode);
    }
    if (this.props.onAnySet) {
      this.props.onAnySet(this.state.search, mode, this.state.type);
    }
  }

  private handleTypeSet(type: SearchType): void {
    this.setState({type});
    if (this.props.onTypeSet) {
      this.props.onTypeSet(type);
    }
    if (this.props.onAnySet) {
      this.props.onAnySet(this.state.search, this.state.mode, type);
    }
  }

  public render(): ReactNode {
    let modeSpecs = [
      {value: "both", label: "単語＋訳語"},
      {value: "name", label: "単語"},
      {value: "equivalent", label: "訳語"},
      {value: "content", label: "全文"}
    ] as const;
    let typeSpecs = [
      {value: "prefix", label: "前方"},
      {value: "part", label: "部分"},
      {value: "exact", label: "完全"},
      {value: "regular", label: "正規"}
    ] as const;
    let node = (
      <form styleName="root">
        <Input initialValue={this.props.initialSearch} onSet={this.handleSearchSet.bind(this)}/>
        <div styleName="radio-wrapper">
          <RadioGroup name="mode" initialValue={this.props.initialMode || "both"} specs={modeSpecs} onSet={this.handleModeSet.bind(this)}/>
          <RadioGroup name="type" initialValue={this.props.initialType || "prefix"} specs={typeSpecs} onSet={this.handleTypeSet.bind(this)}/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  initialSearch?: string,
  initialMode?: SearchMode,
  initialType?: SearchType,
  onSearchSet?: (search: string) => void;
  onModeSet?: (mode: SearchMode) => void;
  onTypeSet?: (type: SearchType) => void;
  onAnySet?: (search: string, mode: SearchMode, type: SearchType) => void;
};
type State = {
  search: string,
  mode: SearchMode,
  type: SearchType
};