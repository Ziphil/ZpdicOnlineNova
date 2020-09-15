//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./dictionary-aggregation-pane.scss"))
export default class DictionaryAggregationPane extends Component<Props, State> {

  public state: State = {
    dictionarySize: null,
    wordSize: null
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchDictionaryAggregation", {}, true);
    if (response.status === 200) {
      let body = response.data;
      this.setState(body);
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="size-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.dictionarySize")}</div>
          <div styleName="size">{this.transNumber(this.state.dictionarySize)}</div>
        </div>
        <div styleName="size-wrapper">
          <div styleName="title">{this.trans("dictionaryAggregationPane.wordSize")}</div>
          <div styleName="size">{this.transNumber(this.state.wordSize)}</div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dictionarySize: number | null,
  wordSize: number | null;
};