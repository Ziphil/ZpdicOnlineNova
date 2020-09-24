//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./dictionary-aggregation-pane.scss"))
export default class DictionaryAggregationPane extends Component<Props, State> {

  public state: State = {
    dictionaryCount: null,
    wordCount: null,
    dictionarySize: null,
    wordSize: null
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchDictionaryAggregation", {}, {ignoreError: true});
    if (response.status === 200) {
      let body = response.data;
      this.setState(body);
    }
  }

  public render(): ReactNode {
    let dictionaryCount = this.state.dictionaryCount;
    let wordCount = this.state.wordCount;
    let wordSize = (this.state.wordSize !== null) ? this.state.wordSize / 1048576 : null;
    let node = (
      <div styleName="root">
        <div styleName="count-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.dictionaryCount")}</div>
          <div styleName="count">{this.transNumber(dictionaryCount)}</div>
          <div styleName="size"></div>
        </div>
        <div styleName="count-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.wordCount")}</div>
          <div styleName="count">{this.transNumber(wordCount)}</div>
          <div styleName="size">{this.transNumber(wordSize, 2)} MB</div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionaryCount: number | null,
  wordCount: number | null,
  dictionarySize: number | null,
  wordSize: number | null;
};