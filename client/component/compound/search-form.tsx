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
    search: ""
  };

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
        <Input onValueChange={(value) => this.setState({search: value})}/>
        <RadioGroup name="mode" initialValue="both" specs={searchModeSpecs}/>
        <RadioGroup name="type" initialValue="prefix" specs={searchTypeSpecs}/>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
  search: string
};

export let SearchForm = withRouter(SearchFormBase);