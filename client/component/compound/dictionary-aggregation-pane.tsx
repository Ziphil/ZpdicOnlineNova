//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Aggregation
} from "/client/skeleton/aggregation";


@style(require("./dictionary-aggregation-pane.scss"))
export default class DictionaryAggregationPane extends Component<Props, State> {

  public state: State = {
    dictionary: null,
    word: null,
    example: null
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
    let example = this.state.example;
    let node = (
      <div styleName="root">
        <div styleName="count-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.dictionaryCount")}</div>
          <div styleName="count">{this.transNumber(dictionary?.count)}</div>
          <div styleName="slash">/</div>
          <div styleName="whole-count">{this.transNumber(dictionary?.wholeCount)}</div>
          <div styleName="title">{this.trans("dictionaryAggregationPane.wordCount")}</div>
          <div styleName="count">{this.transNumber(word?.count)}</div>
          <div styleName="slash">/</div>
          <div styleName="whole-count">{this.transNumber(word?.wholeCount)}</div>
          <div styleName="title">{this.trans("dictionaryAggregationPane.exampleCount")}</div>
          <div styleName="count">{this.transNumber(example?.count)}</div>
          <div styleName="slash">/</div>
          <div styleName="whole-count">{this.transNumber(example?.wholeCount)}</div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionary: Aggregation | null,
  word: Aggregation | null,
  example: Aggregation | null
};