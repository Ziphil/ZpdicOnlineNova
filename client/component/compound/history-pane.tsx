//

import * as react from "react";
import {
  ReactNode
} from "react";
import Chart from "/client/component/atom/chart";
import {
  ChartConfig,
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


@style(require("./history-pane.scss"))
export default class HistoryPane extends Component<Props, State> {

  public state: State = {
    data: null,
    maxAxis: 10,
    minAxis: 0
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.dictionary.number;
    let from = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toString();
    let response = await this.request("fetchHistories", {number, from});
    if (response.status === 200 && !("error" in response.data)) {
      let histories = response.data;
      let dates = [...histories.map((history) => new Date(history.date)), new Date()];
      let wordSizes = [...histories.map((history) => history.wordSize), this.props.dictionary.wordSize];
      let maxWordSize = Math.max(...wordSizes);
      let minWordSize = Math.min(...wordSizes);
      let maxAxis = maxWordSize + Math.max((maxWordSize - minWordSize) * 0.05, 10);
      let minAxis = Math.max(minWordSize - Math.max((maxWordSize - minWordSize) * 0.05, 10), 0);
      let data = {x: "date", columns: [["date", ...dates], ["wordSize", ...wordSizes]], types: {wordSize: "area"}} as ChartData;
      this.setState({data, maxAxis, minAxis});
    } else {
      this.setState({data: null, maxAxis: 10, minAxis: 0});
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let padding = 24 * 60 * 60 * 1000;
    let config = {
      padding: {left: 45},
      axis: {
        x: {tick: {format: this.transShortDate.bind(this)}, padding: {left: padding, right: padding}, type: "timeseries"},
        y: {tick: {format: this.transNumber.bind(this)}, max: this.state.maxAxis, min: this.state.minAxis, padding: {top: 0, bottom: 0}}
      }
    } as ChartConfig;
    let node = (
      <div styleName="root">
        <Loading loading={this.state.data === null}>
          <Chart className={styles["chart"]} data={this.state.data!} config={config}/>
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
  data: ChartData | null,
  maxAxis: number,
  minAxis: number
};