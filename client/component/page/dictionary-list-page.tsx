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

  private async fetchDictionaries(offset?: number, size?: number): Promise<{hitSize: number, hitItems: Array<DetailedDictionary>}> {
    let response = await this.requestGet("fetchAllDictionaries", {offset, size});
    if (response.status === 200) {
      let hitSize = response.data.hitSize;
      let hitItems = response.data.hitDictionaries;
      return {hitSize, hitItems};
    } else {
      return {hitSize: 0, hitItems: []};
    }
  }

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="list">
          <DictionaryList dictionaries={this.fetchDictionaries.bind(this)} size={20}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};