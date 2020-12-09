//

import {
  ChartAPI,
  Data,
  DataPoint,
  ChartConfiguration as FullChartConfig,
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
    this.drawChart();
  }

  public componentDidUpdate(previousProps: any): void {
    if (this.props !== previousProps) {
      this.drawChart();
    }
  }

  public componentWillUnmount(): void {
    this.chart?.destroy();
  }

  private drawChart(): void {
    let bindto = findDOMNode(this) as HTMLElement;
    let data = this.props.data;
    let renderTooltip = function (data: Array<DataPoint>, formatTitle: unknown, formatValue: (args: any) => any): string {
      let valueString = formatValue(data[0].value);
      return `<div class="c3-zptooltip">${valueString}</div>`;
    };
    let defaultConfig = {
      transition: {duration: null},
      grid: {y: {show: true}},
      axis: {x: {tick: {outer: false}}, y: {tick: {outer: false}}},
      point: {r: 3},
      legend: {show: false},
      tooltip: {contents: renderTooltip}
    };
    let config = merge(defaultConfig, this.props.config);
    this.chart = generateChart({bindto, data, ...config});
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
  config?: ChartConfig
};
type State = {
};

export type ChartData = Data;
export type ChartDataRow = PrimitiveArray;
export type ChartDataColumn = [string, ...PrimitiveArray];
export type ChartConfig = Omit<FullChartConfig, "bindto" | "data">;