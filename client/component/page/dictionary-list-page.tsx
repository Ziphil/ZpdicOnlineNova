//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  DictionaryList,
  Header,
  Loading,
  PopupInformationPane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-list-page.scss"))
export class DictionaryListPage extends StoreComponent<Props, State, Params> {

  public state: State = {
    dictionaries: null
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchAllDictionaries", {});
    if (response.status === 200) {
      let dictionaries = response.data;
      this.setState({dictionaries});
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="page">
        <Header/>
        <PopupInformationPane/>
        <div styleName="content">
          <Loading loading={this.state.dictionaries === null}>
            <DictionaryList dictionaries={this.state.dictionaries!} showsSetting={false}/>
          </Loading>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionaries: Array<SlimeDictionarySkeleton> | null;
};
type Params = {
  mode: string
};