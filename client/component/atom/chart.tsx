//

import {
  ChartAPI,
  ChartConfiguration,
  Data,
  PrimitiveArray,
  generate as generateChart
} from "c3";
import merge from "lodash-es/merge";
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


@style(require("./chart.scss"))
export default class Chart extends Component<Props, State> {

  private chart: ChartAPI | null = null;

  public componentDidMount(): void {
    let bindto = findDOMNode(this) as HTMLElement;
    let data = this.props.data;
    let defaultConfig = {
      interaction: {enabled: false},
      grid: {y: {show: true}},
      axis: {x: {tick: {outer: false}}, y: {tick: {outer: false}}},
      point: {r: 3},
      legend: {show: false},
      tooltip: {show: false}
    };
    let config = merge(defaultConfig, this.props.config);
    this.chart = generateChart({bindto, data, ...config});
  }

  public componentWillUnmount(): void {
    this.chart?.destroy();
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root" className={this.props.className}/>
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

export type ChartData = Data;
export type ChartDataRow = PrimitiveArray;
export type ChartDataColumn = [string, ...PrimitiveArray];