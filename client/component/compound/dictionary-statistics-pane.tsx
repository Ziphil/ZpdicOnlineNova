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
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./dictionary-statistics-pane.scss"))
export default class DictionaryStatisticsPane extends Component<Props, State> {

  public state: State = {
    data: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.dictionary.number;
    let from = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toString();
    let response = await this.requestGet("fetchHistories", {number, from});
    if (response.status === 200 && !("error" in response.data)) {
      let histories = response.data;
      let dates = histories.map((history) => new Date(history.date));
      let wordSizes = histories.map((history) => history.wordSize);
      let data = {x: "date", columns: [["date", ...dates], ["wordSizes", ...wordSizes]]} as ChartData;
      this.setState({data});
    } else {
      this.setState({data: null});
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let padding = 0.3 * 24 * 60 * 60 * 1000;
    let config = {
      padding: {left: 45},
      axis: {
        x: {tick: {format: this.transShortDate.bind(this)}, padding: {left: padding, right: padding}, type: "timeseries"},
        y: {tick: {format: this.transNumber.bind(this)}}
      }
    } as const;
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
  dictionary: Dictionary
};
type State = {
  data: ChartData | null
};