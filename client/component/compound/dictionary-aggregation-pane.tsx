//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/util/decorator";


@route @inject
@applyStyle(require("./dictionary-aggregation-pane.scss"))
export class DictionaryAggregationPane extends StoreComponent<Props, State> {

  public state: State = {
    dictionarySize: 0,
    wordSize: 0
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchDictionaryAggregation", {}, true);
    if (response.status === 200) {
      let body = response.data;
      this.setState(body);
    }
  }

  public render(): ReactNode {
    let dictionarySizeString = this.state.dictionarySize.toLocaleString("en-GB");
    let wordSizeString = this.state.wordSize.toLocaleString("en-GB");
    let node = (
      <div styleName="root">
        <div styleName="size-wrapper">
          <div styleName="title">総辞書数</div>
          <div styleName="size">{dictionarySizeString}</div>
        </div>
        <div styleName="size-wrapper">
          <div styleName="title">総単語数</div>
          <div styleName="size">{wordSizeString}</div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionarySize: number,
  wordSize: number;
};