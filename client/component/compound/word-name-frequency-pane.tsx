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
      let columns = Object.entries<any>(frequencies).map(([char, frequency]) => [char, frequency.all]);
      columns.sort((firstColumn, secondColumn) => secondColumn[1] - firstColumn[1]);
      let data = {columns, type: "pie"} as ChartData;
      this.setState({data});
    } else {
      this.setState({data: null});
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let config = {
      legend: {show: true}
    };
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