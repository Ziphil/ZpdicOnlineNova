//

import * as react from "react";
import {
  ReactNode
} from "react";
import Chart from "/client/component/atom/chart";
import {
  ChartData
} from "/client/component/atom/chart";
import Component from "/client/component/component";
import Loading from "/client/component/compound/loading";
import {
  style
} from "/client/component/decorator";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";


@style(require("./word-name-frequency-pane.scss"))
export default class WordNameFrequencyPane extends Component<Props, State> {

  public state: State = {
    data: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.dictionary.number;
    let response = await this.request("fetchWordNameFrequencies", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let [wholeFrequency, frequencies] = response.data;
    } else {
      this.setState({data: null});
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let node = (
      <div styleName="root">
        <Loading loading={this.state.data === null}>
          Not yet implemented
        </Loading>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: DetailedDictionary
};
type State = {
  data: ChartData | null
};