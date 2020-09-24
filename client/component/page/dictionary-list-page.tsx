//

import * as react from "react";
import {
  ReactNode
} from "react";
import RadioGroup from "/client/component/atom/radio-group";
import Component from "/client/component/component";
import DictionaryList from "/client/component/compound/dictionary-list";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  WithSize
} from "/server/controller/type";
import {
  DetailedDictionary
} from "/server/skeleton/dictionary";


@style(require("./dictionary-list-page.scss"))
export default class DictionaryListPage extends Component<Props, State> {

  public state: State = {
    order: "updatedDate"
  };

  private async fetchDictionaries(offset?: number, size?: number): Promise<WithSize<DetailedDictionary>> {
    let order = this.state.order;
    let response = await this.requestGet("fetchAllDictionaries", {order, offset, size});
    if (response.status === 200) {
      let hitResult = response.data;
      return hitResult;
    } else {
      return [[], 0];
    }
  }

  public render(): ReactNode {
    let specs = [
      {value: "updatedDate", label: this.trans("dictionaryListPage.updatedDate")},
      {value: "createdDate", label: this.trans("dictionaryListPage.createdDate")}
    ];
    let node = (
      <Page>
        <div styleName="search-form">
          <RadioGroup name="order" value={this.state.order} specs={specs} onSet={(order) => this.setState({order})}/>
        </div>
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
  order: string
};