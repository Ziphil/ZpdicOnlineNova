//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  DictionaryList
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
  WithSize
} from "/server/controller/type";
import {
  DetailedDictionary
} from "/server/skeleton/dictionary";


@route @inject
@applyStyle(require("./dictionary-list-page.scss"))
export class DictionaryListPage extends StoreComponent<Props, State> {

  private async fetchDictionaries(offset?: number, size?: number): Promise<WithSize<DetailedDictionary>> {
    let response = await this.requestGet("fetchAllDictionaries", {offset, size});
    if (response.status === 200) {
      let hitResult = response.data;
      return hitResult;
    } else {
      return [[], 0];
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