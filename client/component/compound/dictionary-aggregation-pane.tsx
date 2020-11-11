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
    dictionary: null,
    word: null
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.request("fetchDictionaryAggregation", {}, {ignoreError: true});
    if (response.status === 200) {
      let body = response.data;
      this.setState(body);
    }
  }

  public render(): ReactNode {
    let dictionary = this.state.dictionary;
    let word = this.state.word;
    let node = (
      <div styleName="root">
        <div styleName="count-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.dictionaryCount")}</div>
          <div styleName="count">
            <div styleName="exist">{this.transNumber(dictionary?.count)}</div>
            <div styleName="whole">{this.transNumber(dictionary?.wholeCount)}</div>
          </div>
        </div>
        <div styleName="count-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.wordCount")}</div>
          <div styleName="count">
            <div styleName="exist">{this.transNumber(word?.count)}</div>
            <div styleName="whole">{this.transNumber(word?.wholeCount)}</div>
          </div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: {count: number, wholeCount: number, size: number} | null,
  word: {count: number, wholeCount: number, size: number} | null
};