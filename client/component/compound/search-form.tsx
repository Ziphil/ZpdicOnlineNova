//

import * as react from "react";
import {
  ReactNode
} from "react";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import {
  Component
} from "/client/component/component";
import {
  applyStyle,
  intl
} from "/client/component/decorator";
import {
  NormalSearchParameter,
  SearchMode,
  SearchType
} from "/server/skeleton/search-parameter";


@intl
@applyStyle(require("./search-form.scss"))
export default class SearchForm extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    parameter: {search: "", mode: "both", type: "prefix"}
  };

  private handleSearchSet(search: string): void {
    this.setState({search});
    if (this.props.onSearchSet) {
      this.props.onSearchSet(search);
    }
    if (this.props.onParameterSet) {
      let mode = this.props.parameter.mode;
      let type = this.props.parameter.type;
      this.props.onParameterSet({search, mode, type});
    }
  }

  private handleModeSet(mode: SearchMode): void {
    this.setState({mode});
    if (this.props.onModeSet) {
      this.props.onModeSet(mode);
    }
    if (this.props.onParameterSet) {
      let search = this.props.parameter.search;
      let type = this.props.parameter.type;
      this.props.onParameterSet({search, mode, type});
    }
  }

  private handleTypeSet(type: SearchType): void {
    this.setState({type});
    if (this.props.onTypeSet) {
      this.props.onTypeSet(type);
    }
    if (this.props.onParameterSet) {
      let search = this.props.parameter.search;
      let mode = this.props.parameter.mode;
      this.props.onParameterSet({search, mode, type});
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
    let node = (
      <form styleName="root" onSubmit={(event) => event.preventDefault()}>
        <Input value={this.props.parameter.search} onSet={this.handleSearchSet.bind(this)}/>
        <div styleName="radio-wrapper">
          <RadioGroup name="mode" value={this.props.parameter.mode} specs={modeSpecs} onSet={this.handleModeSet.bind(this)}/>
        </div>
        <div styleName="radio-wrapper">
          <RadioGroup name="type" value={this.props.parameter.type} specs={typeSpecs} onSet={this.handleTypeSet.bind(this)}/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  parameter: NormalSearchParameter,
  onSearchSet?: (search: string) => void;
  onModeSet?: (mode: SearchMode) => void;
  onTypeSet?: (type: SearchType) => void;
  onParameterSet?: (parameter: NormalSearchParameter) => void;
};
type DefaultProps = {
  parameter: NormalSearchParameter
};
type State = {
};