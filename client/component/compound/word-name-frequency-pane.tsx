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


@style(require("./word-name-frequency-pane.scss"))
export default class WordNameFrequencyPane extends Component<Props, State> {

  public state: State = {
    data: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.dictionary.number;
    let response = await this.request("fetchWordNameFrequencies", {number});
    if (response.status === 200 && !("error" in response.data)) {
      let [, frequencies] = response.data;
      let rawColumns = Object.entries<any>(frequencies).map(([char, frequency]) => [char, frequency.all]).sort((firstColumn, secondColumn) => secondColumn[1] - firstColumn[1]);
      let formerColumns = rawColumns.slice(0, 20);
      let otherColumns = (rawColumns.length > 20) ? [[this.trans("wordNameFrequencyPane.others"), rawColumns.slice(20, -1).reduce((sum, column) => sum + column[1], 0)]] : [];
      let columns = [...formerColumns, ...otherColumns];
      let colors = Object.fromEntries([[this.trans("wordNameFrequencyPane.others"), "hsl(30, 40%, 50%)"]]);
      let data = {columns, colors, type: "pie", order: null} as ChartData;
      this.setState({data});
    } else {
      this.setState({data: null});
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let config = {
      padding: {top: 0, bottom: 0, left: 0, right: 0},
      legend: {show: true},
      customTooltip: {
        format: {
          value: (value, total) => this.trans("wordNameFrequencyPane.value", {value, total}),
          percent: (percent) => this.trans("wordNameFrequencyPane.percent", {percent})
        }
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
  data: ChartData | null
};