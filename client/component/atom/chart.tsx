//

import {
  ChartAPI,
  ChartConfiguration,
  Data as ChartData,
  generate as generateChart
} from "c3";
import * as react from "react";
import {
  ReactNode
} from "react";
import {
  findDOMNode
} from "react-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./chart.scss"))
export default class Chart extends Component<Props, State> {

  private chart: ChartAPI | null = null;

  public componentDidMount(): void {
    let bindto = findDOMNode(this) as HTMLElement;
    let data = this.props.data;
    let config = this.props.config;
    let defaultConfig = {
      interaction: {enabled: false},
      legend: {show: false},
      tooltip: {show: false}
    };
    this.chart = generateChart({bindto, data, ...defaultConfig, ...config});
  }

  public componentWillUnmount(): void {
    this.chart?.destroy();
  }

  public render(): ReactNode {
    let node = (
      <div className={this.props.className}/>
    );
    return node;
  }

}


type Props = {
  className?: string,
  data: ChartData,
  config?: Omit<ChartConfiguration, "bindto" | "data">
};
type State = {
};