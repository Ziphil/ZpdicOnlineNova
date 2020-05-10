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
  Loading
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";
import {
  DetailedDictionary
} from "/server/skeleton/dictionary";


@route @inject
@applyStyle(require("./dictionary-list-page.scss"))
export class DictionaryListPage extends StoreComponent<Props, State> {

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
      <Page>
        <div styleName="list">
          <Loading loading={this.state.dictionaries === null}>
            <DictionaryList dictionaries={this.state.dictionaries!} size={20}/>
          </Loading>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionaries: Array<DetailedDictionary> | null;
};