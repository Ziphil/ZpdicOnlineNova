//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  DictionaryCreationForm,
  DictionaryList,
  Header,
  Menu,
  SettingPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";
import {
  SlimeDictionarySkeleton
} from "/server/model/dictionary/slime";


@applyStyle(require("./dictionary-list-page.scss"))
class DictionaryListPageBase extends ComponentBase<Props, State, Params> {

  public state: State = {
    dictionaries: []
  };

  public async componentDidMount(): Promise<void> {
    let response = await http.get("dictionaryListAll", {});
    let dictionaries = response.data;
    this.setState({dictionaries});
  }

  public render(): ReactNode {
    let node = (
      <div styleName="page">
        <Header/>
        <div styleName="content">
          <DictionaryList dictionaries={this.state.dictionaries}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionaries: Array<SlimeDictionarySkeleton>;
};
type Params = {
  mode: string
};

export let DictionaryListPage = withRouter(DictionaryListPageBase);